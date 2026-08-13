const cron = require('node-cron');
const pool = require('../config/db');

module.exports = (io) => {  
  io.on('connection', (socket) => {
   console.log(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

async function checkPaymentsAndNotify() {
 try {
  const upcomingResult = await pool.query(
  `SELECT p.*,
    u.unit_number, b.name AS building_name,
    t.full_name AS tenant_name
    FROM payments p
    JOIN contracts c ON p.contract_id = c.contract_id
    JOIN units u ON c.unit_id = u.unit_id
    JOIN buildings b ON u.building_id = b.building_id
    JOIN tenants t ON c.tenant_id = t.tenant_id
    WHERE p.status = 'pending'
    AND p.due_date = CURRENT_DATE + INTERVAL '3 days'`
  );
  upcomingResult.rows.forEach((payment) => {
    io.emit('payment:upcoming', {
      message:`Payment of 3days for tenant: ${payment.tenant_name} - ${payment.building_name} (${payment.unit_number})`,
      payment
    });
  });

  const overdueResult = await pool.query(
    `UPDATE Payments
     SET status = 'overdue'
     WHERE status = 'pending' AND due_date < CURRENT_DATE
     RETURNING *`
  );

  for (const payment of overdueResult.rows) {
   const details = await pool.query(
    `SELECT u.unit_number, b.name AS building_name, t.full_name AS tenant_name
     FROM contracts c
     JOIN units u ON c.unit_id = u.unit_id
     JOIN buildings b ON u.building_id = b.building_id
     JOIN tenants t ON c.tenant_id = t.tenant_id
     WHERE c.contarct_id = $1`,
     [payment.contract_id]
   );

  io.emit('payment:overdue', {
   message: `Delay payment: ${details.rows[0].tenant_name} - ${details.rows[0].building_name} (${details.rows[0].unit_number})`,
   payment
  });
}

 console.log(`Checked payments: ${upcomingResult.rows.length} upcoming, ${overdueResult.rows.length} newly overdue`);
} catch(err) {
  console.error('Error checking payments:', err);
  }
 }

 cron.schedule('* * * * *', () => {
  console.log('Runing daily payment check...');
  checkPaymentsAndNotify();  
 });

 checkPaymentsAndNotify();
}
