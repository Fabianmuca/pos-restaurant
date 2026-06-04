const Order    = require('../models/Order');
const Table    = require('../models/Table');
const MenuItem = require('../models/MenuItem');

// Helper: calculate total price from items
const calcTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItem);
    if (menuItem) {
      total += menuItem.price * item.quantity;
    }
  }
  return parseFloat(total.toFixed(2));
};

// @desc    Get all orders (optionally filter by status or table)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.table)  filter.table  = req.query.table;

    const orders = await Order.find(filter)
      .populate('table',            'number status')
      .populate('waiter',           'name role')
      .populate('items.menuItem',   'name price category')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table',          'number status capacity')
      .populate('waiter',         'name role')
      .populate('items.menuItem', 'name price category description');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get active order for a specific table (pending/preparing/ready)
// @route   GET /api/orders/table/:tableId
// @access  Private
const getOrderByTable = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      table:  req.params.tableId,
      status: { $in: ['pending', 'preparing', 'ready'] },
    })
      .populate('table',          'number status capacity')
      .populate('waiter',         'name role')
      .populate('items.menuItem', 'name price category description');

    res.json(order || null);
  } catch (error) {
    next(error);
  }
};

// @desc    Create order — marks table as occupied
// @route   POST /api/orders
// @access  Private (admin + waiter)
const createOrder = async (req, res, next) => {
  try {
    const { table, items } = req.body;

    if (!table || !items || items.length === 0) {
      res.status(400);
      throw new Error('Table and at least one item are required');
    }

    const tableDoc = await Table.findById(table);
    if (!tableDoc) {
      res.status(404);
      throw new Error('Table not found');
    }

    const totalPrice = await calcTotal(items);

    const order = await Order.create({
      table,
      waiter: req.user._id,
      items,
      totalPrice,
    });

    // Mark table as occupied
    tableDoc.status = 'occupied';
    await tableDoc.save();

    const populated = await Order.findById(order._id)
      .populate('table',          'number status capacity')
      .populate('waiter',         'name role')
      .populate('items.menuItem', 'name price category description');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order (items or status)
// @route   PUT /api/orders/:id
// @access  Private (admin + waiter)
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const { items, status } = req.body;

    if (items !== undefined) {
      order.items      = items;
      order.totalPrice = await calcTotal(items);
    }

    if (status !== undefined) {
      order.status = status;
    }

    const updated = await order.save();

    const populated = await Order.findById(updated._id)
      .populate('table',          'number status capacity')
      .populate('waiter',         'name role')
      .populate('items.menuItem', 'name price category description');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (admin only)
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Free the table if order was active
    if (['pending', 'preparing', 'ready'].includes(order.status)) {
      await Table.findByIdAndUpdate(order.table, { status: 'free' });
    }

    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getOrderByTable,
  createOrder,
  updateOrder,
  deleteOrder,
};
