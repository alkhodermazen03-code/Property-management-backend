const pool = require('../config/db');

async function getAllBuildings() {
  const result = await pool.query(
    `SELECT * FROM buildings ORDER BY created_at DESC`
  );
  return result.rows;
}

async function getBuildingById(buildingId) {
  const result = await pool.query(
    `SELECT * FROM buildings WHERE building_id = $1`,
    [buildingId]
  );
  return result.rows[0];
}

async function createBuilding(name, address) {
  const result = await pool.query(
    `INSERT INTO buildings (name, address) 
    VALUES ($1, $2)
    RETURNING *`,
    [name, address]
  );
  return result.rows[0];
}

async function updateBuilding(buildingId, name, address) {
  const result = await pool.query(
    `UPDATE buildings 
    SET name = $1, address = $2 
    WHERE building_id = $3
    RETURNING *`,
    [name, address, buildingId]
  );
  return result.rows[0];
}

async function deleteBuilding(buildingId) {
  const result = await pool.query(
    `DELETE FROM buildings WHERE building_id = $1
    RETURNING *`,
    [buildingId]
  );
  return result.rows[0];
}

module.exports = {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding
};