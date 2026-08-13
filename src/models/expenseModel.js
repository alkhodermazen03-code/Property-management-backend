const pool = require('../config/db');

async function getAllExpenses() {
    const result = await pool.query(
        `SELECT e.*,b.name AS building_name, u.full_name As added_by_name
          FROM expenses e
          LEFT JOIN buildings b ON e.building_id = b.building_id
          LEFT JOIN system_users u ON e.added_by_user_id = u.user_id
          ORDER BY e.expense_date DESC`
    );
    return result.rows;
}

async function getExpensesByBuilding(buildingId) {
  const result = await pool.query(
    `SELECT * FROM expenses WHERE building_id = $1 ORDER BY expense_date DESC`,
        [buildingId]
    );
    return result.rows;
}

async function getExpenseById(expenseId) {
  const result = await pool.query(
   `SELECT e.*, b.name AS building_name, u.full_name AS added_by_name
     FROM expenses e
     LEFT JOIN buildings b ON e.building_id = b.building_id
     LEFT JOIN system_users u ON e.added_by_user_id = u.user_id
     WHERE e.expense_id = $1`,
        [expenseId]
    );
    return result.rows[0];
}

async function createExpense(buildingId, category, amount, expenseDate, description, addedByUserId) {
  const result = await pool.query(
   `INSERT INTO expenses (building_id, category, amount, expense_date, description, added_by_user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [buildingId, category, amount, expenseDate, description, addedByUserId]
  );
  return result.rows[0];
}

async function updateExpense(expenseId, category, amount, expenseDate, description) {
  const result = await pool.query(
   `UPDATE expenses
     SET category = $1, amount = $2, expense_date = $3, description = $4
     WHERE expense_id = $5
     RETURNING *`,
    [category, amount, expenseDate, description, expenseId]
  );
  return result.rows[0];
}

async function deleteExpense(expenseId) {
 const result = await pool.query(
   `DELETE FROM expenses WHERE expense_id = $1 RETURNING *`,
    [expenseId]
  );
  return result.rows[0];
}

module.exports = {
  getAllExpenses,
  getExpensesByBuilding,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};