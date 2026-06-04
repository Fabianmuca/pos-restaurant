const express = require('express');
const router  = express.Router();

const {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');

const { protect }        = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

// All authenticated roles can view tables
router.get('/',    getTables);
router.get('/:id', getTableById);

// Only admin can create/update/delete tables
router.post('/',      authorizeRoles('admin'),           createTable);
router.put('/:id',    authorizeRoles('admin', 'waiter'), updateTable);
router.delete('/:id', authorizeRoles('admin'),           deleteTable);

module.exports = router;
