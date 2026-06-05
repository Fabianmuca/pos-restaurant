const express = require('express');
const router  = express.Router();

const {
  getPayments,
  getPaymentById,
  createPayment,
} = require('../controllers/paymentController');

const { protect }        = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorizeRoles('admin', 'cashier', 'waiter'));

router.get('/',    getPayments);
router.get('/:id', getPaymentById);
router.post('/',   createPayment);

module.exports = router;
