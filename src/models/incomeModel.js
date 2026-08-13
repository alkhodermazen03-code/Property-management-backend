const pool = require('../config/db');

async function getAllIncome() {
  const result = await pool.query(
      `SELECT i.*, b.name AS building_name
        FROM income i
        LEFT JOIN buildings b ON i.building_id = b.building_id
        ORDER BY i.income_date DESC`
  );
  return result.rows;
}

async function getIncomeByBuilding(buildingId) {
  const result = await pool.query(
      `SELECT * FROM income WHERE building_id = $1 ORDER BY income_date DESC`,
      [buildingId]
  );
  return result.rows;
}

async function getIncomeById(incomeId) {
  const result = await pool.query(
      `SELECT i.*, b.name AS building_name
        FROM income i
        LEFT JOIN buildings b ON i.building_id = b.building_id
        WHERE i.income_id = $1`,
      [incomeId]
  );
  return result.rows[0];
}

async function createIncome(buildingId, source, amount, incomeDate, description) {
  const result = await pool.query(
      `INSERT INTO income (building_id, source, amount, income_date, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
      [buildingId, source, amount, incomeDate, description]
  );
  return result.rows[0];
}

async function updateIncome(incomeId, source, amount, incomeDate, description) {
  const result = await pool.query(
      `UPDATE income
        SET source = $1, amount = $2, income_date = $3, description = $4
        WHERE income_id = $5
        RETURNING *`,
      [source, amount, incomeDate, description, incomeId]
  );
  return result.rows[0];
}

async function deleteIncome(incomeId) {
  const result = await pool.query(
      `DELETE FROM income WHERE income_id = $1 RETURNING *`,
      [incomeId]
  );
  return result.rows[0];
}

module.exports = {
  getAllIncome,
  getIncomeByBuilding,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
};