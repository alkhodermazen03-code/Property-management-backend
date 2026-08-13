const {
    getAllIncome,
    getIncomeByBuilding,
    getIncomeById,
    createIncome,
    updateIncome,
    deleteIncome
} = require('../models/incomeModel');

async function getIncomes(req, res) {
    try {
        const income = await getAllIncome();
        res.json(income);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getIncomesForBuilding(req, res) {
    try {
        const income = await getIncomeByBuilding(req.params.buildingId);
        res.json(income);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getIncome(req, res) {
    try {
        const income = await getIncomeById(req.params.id);
        if (!income) {
            return res.status(404).json({ error: 'Income not found' });
        }
        res.json(income);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addIncome(req, res) {
    try {
        const { buildingId, source, amount, incomeDate, description } = req.body;
        if (!source || !amount || !incomeDate) {
            return res.status(400).json({ error: 'source, amount and incomeDate are required' });
        }
        const newIncome = await createIncome(buildingId || null, source, amount, incomeDate, description);
        res.status(201).json(newIncome);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function editIncome(req, res) {
    try {
        const { source, amount, incomeDate, description } = req.body;
        const updated = await updateIncome(req.params.id, source, amount, incomeDate, description);
        if (!updated) {
            return res.status(404).json({ error: 'Income not found' });
        }
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function removeIncome(req, res) {
    try {
        const deleted = await deleteIncome(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Income not found' });
        }
        res.json({ message: 'Income deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { 
  getIncomes, 
  getIncomesForBuilding, 
  getIncome, 
  addIncome, 
  editIncome, 
  removeIncome
 };