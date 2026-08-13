const {
    getAllPayments,
    getPaymentsByContract,
    getPaymentById,
    getOverduePayments,
    markPaymentAsPaid,
    updatePayment,
    deletePayment
} = require('../models/paymentModel');

async function getPayments(req, res) {
    try {
        const payments = await getAllPayments();
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPaymentsForContract(req, res) {
    try {
        const payments = await getPaymentsByContract(req.params.contractId);
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPayment(req, res) {
    try {
        const payment = await getPaymentById(req.params.id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getOverdue(req, res) {
    try {
        const overduePayments = await getOverduePayments();
        res.json(overduePayments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// أي دور (owner/admin/employee) بيقدر يستخدمها
async function payPayment(req, res) {
    try {
        const userId = req.user.userId;
        const paid = await markPaymentAsPaid(req.params.id, userId);
        if (!paid) {
            return res.status(404).json({ error: 'Payment not found or already paid' });
        }
        res.json({ message: 'Payment marked as paid', payment: paid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function editPayment(req, res) {
    try {
        const { dueDate, amount } = req.body;
        const updated = await updatePayment(req.params.id, dueDate, amount);
        if (!updated) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function removePayment(req, res) {
    try {
        const deleted = await deletePayment(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json({ message: 'Payment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getPayments,
    getPaymentsForContract,
    getPayment,
    getOverdue,
    payPayment,
    editPayment,
    removePayment
};