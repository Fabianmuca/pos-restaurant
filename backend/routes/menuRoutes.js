const express = require('express');
const router  = express.Router();

const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

const { protect }        = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(protect);

router.get('/',    getMenuItems);
router.get('/:id', getMenuItemById);

// Admin only for write operations
router.post('/',    authorizeRoles('admin'), createMenuItem);
router.put('/:id',  authorizeRoles('admin'), updateMenuItem);
router.delete('/:id', authorizeRoles('admin'), deleteMenuItem);

module.exports = router;
