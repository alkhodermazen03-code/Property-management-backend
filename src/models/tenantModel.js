const pool = require('../config/db');

async function getAllTenants() {
    const result = await pool.query(
        `SELECT * FROM tenants ORDER BY created_at DESC`
    );
    return result.rows;
}

async function getTenantById(tenantId) {
    const result = await pool.query(
        `SELECT * FROM tenants WHERE tenant_id = $1`,
        [tenantId]
    );
    return result.rows[0];
}

async function findTenantByNameAndPhone(fullName, phone) {
    const result = await pool.query(
        `SELECT * FROM tenants WHERE full_name = $1 AND phone = $2`,
        [fullName, phone]
    );
    return result.rows[0];
}

async function createTenant(fullName, phone, email, nationality) {
    const result = await pool.query(
        `INSERT INTO tenants (full_name, phone, email, nationality)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [fullName, phone, email, nationality]
    );
    return result.rows[0];
}

async function updateTenant(tenantId, fullName, phone, email, nationality) {
    const result = await pool.query(
        `UPDATE tenants
         SET full_name = $1, phone = $2, email = $3, nationality = $4
         WHERE tenant_id = $5
         RETURNING *`,
        [fullName, phone, email, nationality, tenantId]
    );
    return result.rows[0];
}

async function deleteTenant(tenantId) {
    const result = await pool.query(
        `DELETE FROM tenants WHERE tenant_id = $1 RETURNING *`,
        [tenantId]
    );
    return result.rows[0];
}

module.exports = {
    getAllTenants,
    getTenantById,
    findTenantByNameAndPhone,
    createTenant,
    updateTenant,
    deleteTenant
};