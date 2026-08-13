const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const{
 getExpenses,
 getExpensesForBuilding,
 getExpense,
 addExpense,
 editExpense,
 removeExpense
}= require('../controllers/expenseController');

router.get('/', authenticate, getExpenses);
router.get('/building/:buildingId', authenticate, getExpensesForBuilding);

router.post('/', authenticate, authorize('owner', 'admin'), addExpense);
router.put('/:id', authenticate, authorize('owner', 'admin'), editExpense);
router.delete('/:id', authenticate, authorize('owner'), removeExpense);

module.exports =router;

