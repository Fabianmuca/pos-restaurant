const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'Table number is required'],
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    status: {
      type: String,
      enum: ['free', 'occupied', 'reserved'],
      default: 'free',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Table', tableSchema);
