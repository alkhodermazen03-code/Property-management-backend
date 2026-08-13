const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getIncomes,
  getIncomesForBuilding,
  getIncome,
  addIncome,
  editIncome,
  removeIncome
} = require('../controllers/incomeController');

router.get('/', authenticate, getIncomes);
router.get('/building/:buildingId', authenticate, getIncomesForBuilding);
router.get('/:id', authenticate, getIncome);

router.post('/', authenticate, authorize('owner', 'admin'), addIncome);
router.put('/:id', authenticate, authorize('owner', 'admin'), editIncome);
router.delete('/:id', authenticate, authorize('owner'), removeIncome);

module.exports = router;