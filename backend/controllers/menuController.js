const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Private
const getMenuItems = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.available === 'true') filter.isAvailable = true;

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Private
const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private (admin only)
const createMenuItem = async (req, res, next) => {
  try {
    const { name, category, price, description, isAvailable } = req.body;

    if (!name || !category || price === undefined) {
      res.status(400);
      throw new Error('Name, category and price are required');
    }

    const item = await MenuItem.create({
      name,
      category,
      price,
      description,
      isAvailable,
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (admin only)
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    const { name, category, price, description, isAvailable } = req.body;
    if (name        !== undefined) item.name        = name;
    if (category    !== undefined) item.category    = category;
    if (price       !== undefined) item.price       = price;
    if (description !== undefined) item.description = description;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (admin only)
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    await item.deleteOne();
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
