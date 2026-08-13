const {
  getAllUnits,
  getUnitsByBuilding,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit
} = require('../models/unitModel');

async function getUnits(req, res) {
  try {
    const units = await getAllUnits();
    res.json(units);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUnitsForBuilding(req, res) {
  try {
    const units = await getUnitsByBuilding(req.params.buildingId);
    res.json(units);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUnit(req, res) {
  try {
    const unit = await getUnitById(req.params.id);
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json(unit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function addUnit(req, res) {
  try {
    const { buildingId, unitNumber, floor, area } = req.body;
    if (!buildingId || !unitNumber) {
      return res.status(400).json({ error: 'Building ID and Unit Number are required' });
    }
    const newUnit = await createUnit(buildingId, unitNumber, floor, area);
    res.status(201).json(newUnit);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { 
      return res.status(409).json({ error: 'This unit number already exists in this building' });
    }
    if (err.code === '23503') { 
      return res.status(400).json({ error: 'Building does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function editUnit(req, res) {
  try {
    const { unitNumber, floor, area, status } = req.body;
    const updated = await updateUnit(req.params.id, unitNumber, floor, area, status);
    if (!updated) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function removeUnit(req, res) {
  try {
    const deleted = await deleteUnit(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json({ message: 'Unit deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getUnits,
  getUnitsForBuilding,
  getUnit,
  addUnit,
  editUnit,
  removeUnit
};