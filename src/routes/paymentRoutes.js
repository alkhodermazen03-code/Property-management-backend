const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
    getPayments,
    getPaymentsForContract,
    getPayment,
    getOverdue,
    payPayment,
    editPayment,
    removePayment
} = require('../controllers/paymentController');

router.get('/', authenticate, getPayments);
router.get('/overdue', authenticate, getOverdue);
router.get('/contract/:contractId', authenticate, getPaymentsForContract);
router.get('/:id', authenticate, getPayment);

// كل الأدوار تقدر تأشر دفعة كـ "مدفوعة"
router.patch('/:id/pay', authenticate, authorize('owner', 'admin', 'employee'), payPayment);

router.put('/:id', authenticate, authorize('owner', 'admin'), editPayment);
router.delete('/:id', authenticate, authorize('owner'), removePayment);

module.exports = router;