const pool = require('../config/db');
const { generatePaymentsForContract } = require('./paymentModel');

async function getAllContracts() {
    const result = await pool.query(
        `SELECT c.*, 
          u.unit_number, u.building_id,
          b.name AS building_name,
          t.full_name AS tenant_name, t.phone AS tenant_phone
         FROM contracts c
         JOIN units u ON c.unit_id = u.unit_id
         JOIN buildings b ON u.building_id = b.building_id
         JOIN tenants t ON c.tenant_id = t.tenant_id
         ORDER BY c.created_at DESC`
    );
    return result.rows;
}

async function getContractById(contractId) {
    const result = await pool.query(
        `SELECT c.*, 
                u.unit_number, u.building_id,
                b.name AS building_name,
                t.full_name AS tenant_name, t.phone AS tenant_phone
         FROM contracts c
         JOIN units u ON c.unit_id = u.unit_id
         JOIN buildings b ON u.building_id = b.building_id
         JOIN tenants t ON c.tenant_id = t.tenant_id
         WHERE c.contract_id = $1`,
        [contractId]
    );
    return result.rows[0];
}

async function checkUnitHasActiveContract(unitId) {
    const result = await pool.query(
        `SELECT * FROM contracts WHERE unit_id = $1 AND status = 'active'`,
        [unitId]
    );
    return result.rows[0];
}

async function createContract(
  unitId, 
  tenantId, 
  startDate, 
  endDate, 
  rentAmount, 
  paymentFrequency) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const contractResult = await client.query(
            `INSERT INTO contracts (unit_id, tenant_id, start_date, end_date, rent_amount, payment_frequency)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [unitId, tenantId, startDate, endDate, rentAmount, paymentFrequency]
        );

        const newContract = contractResult.rows[0];

        await client.query(
            `UPDATE units SET status = 'rented' WHERE unit_id = $1`,
            [unitId]
        );

        const paymentsCount = await generatePaymentsForContract(
            client,
            newContract.contract_id,
            startDate,
            endDate,
            rentAmount,
            paymentFrequency
        );

        await client.query('COMMIT');
        return { ...newContract, paymentsGenerated: paymentsCount };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function updateContract(contractId, startDate, endDate, rentAmount, paymentFrequency, status) {
    const result = await pool.query(
        `UPDATE contracts
         SET start_date = $1, end_date = $2, rent_amount = $3, payment_frequency = $4, status = $5
         WHERE contract_id = $6
         RETURNING *`,
        [startDate, endDate, rentAmount, paymentFrequency, status, contractId]
    );
    return result.rows[0];
}

async function terminateContract(contractId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const contractResult = await client.query(
            `UPDATE contracts SET status = 'terminated' WHERE contract_id = $1 RETURNING *`,
            [contractId]
        );

     if (contractResult.rows[0]) {
      await client.query(
       `UPDATE units SET status = 'vacant' WHERE unit_id = $1`,
         [contractResult.rows[0].unit_id]
        );
        await client.query(
        `DELETE FROM payments WHERE contract_id = $1 AND status = 'pending'`,
        [contractId]
        );
      }

    await client.query('COMMIT');
    return contractResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function deleteContract(contractId) {
 const client = await pool.connect();
  try {
   await client.query('BEGIN');

 const contractResult = await client.query(
  `DELETE FROM contracts WHERE contract_id = $1 RETURNING *`,
    [contractId]
 );

  if (contractResult.rows[0]) {
    await client.query(
     `UPDATE units SET status = 'vacant' WHERE unit_id = $1`,
     [contractResult.rows[0].unit_id]
    );
  }

  await client.query('COMMIT');
   return contractResult.rows[0];
    } catch (err) {
    await client.query('ROLLBACK');
    throw err;
    } finally {
    client.release();
    }
}

module.exports = {
    getAllContracts,
    getContractById,
    checkUnitHasActiveContract,
    createContract,
    updateContract,
    terminateContract,
    deleteContract
};