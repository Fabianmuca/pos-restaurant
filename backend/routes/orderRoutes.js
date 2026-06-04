const express = require('express');
const router  = express.Router();

const {
  getOrders,
  getOrderById,
  getOrderByTable,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const { protect }        = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

// Get active order by table — must be before /:id to avoid conflict
router.get('/table/:tableId', getOrderByTable);

router.get('/',    getOrders);
router.get('/:id', getOrderById);

// Admin + waiter can create and update orders
router.post('/',      authorizeRoles('admin', 'waiter'), createOrder);
router.put('/:id',    authorizeRoles('admin', 'waiter'), updateOrder);
router.delete('/:id', authorizeRoles('admin'),           deleteOrder);

module.exports = router;
