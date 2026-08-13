const {
    getAllBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
} = require('../models/buildingModel');

async function getBuildings(req, res) {
    try {
        const buildings = await getAllBuildings();
        res.json(buildings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getBuilding(req, res) {
    try {
        const building = await getBuildingById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.json(building);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addBuilding(req, res) {
    try {
        const { name, address } = req.body;
        if (!name || !address) {
            return res.status(400).json({ error: 'name and address are required' });
        }
        const newBuilding = await createBuilding(name, address);
        res.status(201).json(newBuilding);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function editBuilding(req, res) {
    try {
        const { name, address } = req.body;
        if (!name || !address) {
            return res.status(400).json({ error: 'name and address are required' });
        }
        const updated = await updateBuilding(req.params.id, name, address);
        if (!updated) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function removeBuilding(req, res) {
    try {
        const deleted = await deleteBuilding(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.json({ message: 'building deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
   getBuildings,
   getBuilding, 
   addBuilding, 
   editBuilding, 
   removeBuilding };