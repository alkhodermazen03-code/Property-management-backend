const pool = require('../config/db');

async function createUser(fullName, email, passwordHash, role) {  
  const result = await pool.query(
    `INSERT INTO system_users (full_name, email, password_hash, role) 
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, full_name, email, role, created_at`,
    [fullName, email, passwordHash, role]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM system_users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

async function findUserById(userId) {
  const result = await pool.query(
   `SELECT user_id, full_name, email, role, created_at
    FROM system_users WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};