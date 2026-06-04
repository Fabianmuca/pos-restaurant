const Payment = require('../models/Payment');
const Order   = require('../models/Order');
const Table   = require('../models/Table');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (admin + cashier)
const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate({
        path:     'order',
        populate: [
          { path: 'table',          select: 'number' },
          { path: 'items.menuItem', select: 'name price' },
        ],
      })
      .sort({ paidAt: -1 });

    res.json(payments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private (admin + cashier)
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path:     'order',
      populate: [
        { path: 'table',          select: 'number capacity' },
        { path: 'waiter',         select: 'name' },
        { path: 'items.menuItem', select: 'name price category' },
      ],
    });

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
};

// @desc    Create payment — marks order as paid and table as free
// @route   POST /api/payments
// @access  Private (admin + cashier)
const createPayment = async (req, res, next) => {
  try {
    const { order: orderId, method, amount } = req.body;

    if (!orderId || !method || amount === undefined) {
      res.status(400);
      throw new Error('Order, payment method and amount are required');
    }

    const order = await Order.findById(orderId).populate('table');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.status === 'paid') {
      res.status(400);
      throw new Error('Order has already been paid');
    }

    // Create payment record
    const payment = await Payment.create({
      order:  orderId,
      method,
      amount,
      paidAt: new Date(),
    });

    // Mark order as paid
    order.status = 'paid';
    await order.save();

    // Free the table
    if (order.table) {
      await Table.findByIdAndUpdate(order.table._id, { status: 'free' });
    }

    const populated = await Payment.findById(payment._id).populate({
      path:     'order',
      populate: [
        { path: 'table',          select: 'number' },
        { path: 'items.menuItem', select: 'name price' },
      ],
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPayments, getPaymentById, createPayment };
