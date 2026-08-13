const pool = require('../config/db');

async function getAllUnits() {
    const result = await pool.query(
        `SELECT u.*, b.name AS building_name 
         FROM units u
         JOIN buildings b ON u.building_id = b.building_id
         ORDER BY u.created_at DESC`
    );
    return result.rows;
}

async function getUnitsByBuilding(buildingId) {
    const result = await pool.query(
        `SELECT * FROM units WHERE building_id = $1 ORDER BY unit_number`,
        [buildingId]
    );
    return result.rows;
}

async function getUnitById(unitId) {
    const result = await pool.query(
        `SELECT u.*, b.name AS building_name 
         FROM units u
         JOIN buildings b ON u.building_id = b.building_id
         WHERE u.unit_id = $1`,
        [unitId]
    );
    return result.rows[0];
}

async function findUnitByBuildingAndNumber(buildingName, unitNumber) {
    const result = await pool.query(
        `SELECT u.* FROM units u
         JOIN buildings b ON u.building_id = b.building_id
         WHERE b.name = $1 AND u.unit_number = $2`,
        [buildingName, unitNumber]
    );
    return result.rows[0];
}

async function createUnit(buildingId, unitNumber, floor, area) {
    const result = await pool.query(
        `INSERT INTO units (building_id, unit_number, floor, area)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [buildingId, unitNumber, floor, area]
    );
    return result.rows[0];
}

async function updateUnit(unitId, unitNumber, floor, area, status) {
    const result = await pool.query(
        `UPDATE units
         SET unit_number = $1, floor = $2, area = $3, status = $4
         WHERE unit_id = $5
         RETURNING *`,
        [unitNumber, floor, area, status, unitId]
    );
    return result.rows[0];
}

async function deleteUnit(unitId) {
    const result = await pool.query(
        `DELETE FROM units WHERE unit_id = $1 RETURNING *`,
        [unitId]
    );
    return result.rows[0];
}

module.exports = {
    getAllUnits,
    getUnitsByBuilding,
    getUnitById,
    findUnitByBuildingAndNumber,
    createUnit,
    updateUnit,
    deleteUnit
};