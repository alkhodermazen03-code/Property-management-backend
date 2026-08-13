const {
    getAllExpenses,
    getExpensesByBuilding,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
} = require('../models/expenseModel');

async function getExpenses(req, res) {
  try {
      const expenses = await getAllExpenses();
      res.json(expenses);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function getExpensesForBuilding(req, res) {
  try {
      const expenses = await getExpensesByBuilding(req.params.buildingId);
      res.json(expenses);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function getExpense(req, res) {
  try {
      const expense = await getExpenseById(req.params.id);
      if (!expense) {
          return res.status(404).json({ error: 'Expense not found' });
      }
      res.json(expense);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function addExpense(req, res) {
  try {
    const { buildingId, category, amount, expenseDate, description } = req.body;
    if (!category || !amount || !expenseDate) {
        return res.status(400).json({ error: 'category, amount and expenseDate are required' });
    }
    const userId = req.user.userId;
    const newExpense = await createExpense(buildingId || null, category, amount, expenseDate, description, userId);
    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function editExpense(req, res) {
  try {
    const { category, amount, expenseDate, description } = req.body;
    const updated = await updateExpense(req.params.id, category, amount, expenseDate, description);
    if (!updated) {
        return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(updated);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function removeExpense(req, res) {
  try {
      const deleted = await deleteExpense(req.params.id);
      if (!deleted) {
          return res.status(404).json({ error: 'Expense not found' });
      }
      res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { 
 getExpenses, 
 getExpensesForBuilding, 
 getExpense, 
 addExpense, 
 editExpense, 
 removeExpense 
};