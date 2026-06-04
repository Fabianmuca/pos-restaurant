const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Private
const getTableById = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }
    res.json(table);
  } catch (error) {
    next(error);
  }
};

// @desc    Create table
// @route   POST /api/tables
// @access  Private (admin only)
const createTable = async (req, res, next) => {
  try {
    const { number, capacity, status } = req.body;

    if (!number || !capacity) {
      res.status(400);
      throw new Error('Table number and capacity are required');
    }

    const table = await Table.create({ number, capacity, status });
    res.status(201).json(table);
  } catch (error) {
    next(error);
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private (admin only)
const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    const { number, capacity, status } = req.body;
    if (number   !== undefined) table.number   = number;
    if (capacity !== undefined) table.capacity = capacity;
    if (status   !== undefined) table.status   = status;

    const updated = await table.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private (admin only)
const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    await table.deleteOne();
    res.json({ message: 'Table removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
};
