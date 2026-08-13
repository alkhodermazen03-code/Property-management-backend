const {
    getAllTenants,
    getTenantById,
    createTenant,
    updateTenant,
    deleteTenant
} = require('../models/tenantModel');

async function getTenants(req, res) {
    try {
        const tenants = await getAllTenants();
        res.json(tenants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getTenant(req, res) {
    try {
        const tenant = await getTenantById(req.params.id);
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        res.json(tenant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addTenant(req, res) {
    try {
        const { fullName, phone, email, nationality } = req.body;
        if (!fullName || !phone) {
            return res.status(400).json({ error: 'fullName and phone are required' });
        }
        const newTenant = await createTenant(fullName, phone, email, nationality);
        res.status(201).json(newTenant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function editTenant(req, res) {
    try {
        const { fullName, phone, email, nationality } = req.body;
        const updated = await updateTenant(req.params.id, fullName, phone, email, nationality);
        if (!updated) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function removeTenant(req, res) {
    try {
        const deleted = await deleteTenant(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        res.json({ message: 'Tenant deleted successfully' });
    } catch (err) {
        console.error(err);
        if (err.code === '23503') { 
            return res.status(409).json({ error: 'Cannot delete tenant:they have an exicting contracts' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getTenants, getTenant, addTenant, editTenant, removeTenant };