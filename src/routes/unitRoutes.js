const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
    getUnits,
    getUnitsForBuilding,
    getUnit,
    addUnit,
    editUnit,
    removeUnit
} = require('../controllers/unitController');

router.get('/', authenticate, getUnits);
router.get('/building/:buildingId', authenticate, getUnitsForBuilding);
router.get('/:id', authenticate, getUnit);

router.post('/', authenticate, authorize('owner', 'admin'), addUnit);
router.put('/:id', authenticate, authorize('owner', 'admin'), editUnit);

router.delete('/:id', authenticate, authorize('owner'), removeUnit);

module.exports = router;