const pool = require('../config/db');

async function getAllPayments() {
  const result = await pool.query(
   `SELECT p.*,
     c.unit_id, c.tenant_id,
     u.unit_number, b.name AS building_name,
     t.full_name AS tenant_name
     FROM payments p
     JOIN contracts c ON p.contract_id = c.contract_id
     JOIN units u ON c.unit_id = u.unit_id
     JOIN buildings b ON u.building_id = b.building_id
     JOIN tenants t ON c.tenant_id = t.tenant_id
     ORDER BY p.due_date ASC`
  );
  return result.rows;
}

async function getPaymentsByContract(contractId) {
  const result = await pool.query(
   `SELECT * FROM payments WHERE contract_id = $1 ORDER BY due_date ASC`,
    [contractId]
  );
  return result.rows;
}

async function getPaymentById(paymentId) {
  const result = await pool.query(
   `SELECT p.*,
     c.unit_id, c.tenant_id,
     u.unit_number, b.name AS building_name,
     t.full_name AS tenant_name
     FROM payments p
     JOIN contracts c ON p.contract_id = c.contract_id
     JOIN units u ON c.unit_id = u.unit_id
     JOIN buildings b ON u.building_id = b.building_id
     JOIN tenants t ON c.tenant_id = t.tenant_id
     WHERE p.payment_id = $1`,
    [paymentId]
  );
  return result.rows[0];
}

async function getOverduePayments() {
 const result = await pool.query(
  `SELECT p.*,
    c.unit_id, c.tenant_id,
    u.unit_number, b.name AS building_name,
    t.full_name AS tenant_name, t.phone AS tenant_phone
    FROM payments p
    JOIN contracts c ON p.contract_id = c.contract_id
    JOIN units u ON c.unit_id = u.unit_id
    JOIN buildings b ON u.building_id = b.building_id
    JOIN tenants t ON c.tenant_id = t.tenant_id
    WHERE p.status != 'paid' AND p.due_date < CURRENT_DATE
    ORDER BY p.due_date ASC`
 );
 return result.rows;
}

async function generatePaymentsForContract(client, contractId, startDate, endDate, rentAmount, paymentFrequency) {
  const monthsToAdd = paymentFrequency === 'monthly' ? 1 : paymentFrequency === 'quarterly' ? 3 : 12;

  let currentDate = new Date(startDate);
   const contractEndDate = new Date(endDate);
   const payments = [];

   while(currentDate <= contractEndDate) {
    payments.push({
     due_date: new Date(currentDate).toISOString().split('T')[0]
    });
    currentDate.setMonth(currentDate.getMonth() + monthsToAdd);
  }

  for(const payment of payments) {
    await client.query(
      `INSERT INTO payments (contract_id, due_date, amount, status)
       VALUES ($1, $2, $3, 'pending')`,
      [contractId, payment.due_date, rentAmount]
    );
  }
  return payments.length;
}

async function markPaymentAsPaid(paymentId, userId) {
  const result = await pool.query(
   `UPDATE payments
    SET status = 'paid', paid_date = CURRENT_DATE, paid_by_user_id = $1
    WHERE payment_id = $2 AND status != 'paid'
    RETURNING *`,
    [userId, paymentId]
  );
  return result.rows[0];
}

async function updatePayment(paymentId, dueDate, amount) {
  const result = await pool.query(
   `UPDATE payments
    SET due_date = $1, amount = $2
    WHERE payment_id = $3
    RETURNING *`,
    [dueDate, amount, paymentId]
  );
  return result.rows[0];
}

async function deletePayment(paymentId) {
  const result = await pool.query(
   `DELETE FROM payments WHERE payment_id = $1 RETURNING *`,
    [paymentId]
  );
  return result.rows[0];
}

async function markOverduePayments() {
 const result = await pool.query(
  `UPDATE payments
   SET status = 'overdue'
   WHERE status = 'pending' AND due_date < CURRENT_DATE
   RETURNING *`
 );
 return result.rows;
}

module.exports = {
  getAllPayments,
  getPaymentsByContract,
  getPaymentById,
  getOverduePayments,
  generatePaymentsForContract,
  markPaymentAsPaid,
  updatePayment,
  deletePayment,
  markOverduePayments
};