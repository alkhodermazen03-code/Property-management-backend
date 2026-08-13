const express = require('express');
const router = express.Router();
const { authenticate, authorize} =require('../middleware/auth');
const {
  getBuildings,
  getBuilding,
  addBuilding,
  editBuilding,
  removeBuilding
} = require('../controllers/buildingController');

router.get('/', authenticate, getBuildings);
router.get('/:id', authenticate, getBuilding);

router.post('/', authenticate, authorize('owner', 'admin'), addBuilding);
router.put('/:id', authenticate, authorize('owner', 'admin'), editBuilding);

router.delete('/:id', authenticate, authorize('owner'), removeBuilding);

module.exports = router;