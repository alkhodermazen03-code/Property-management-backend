const {
  getAllContracts,
  getContractById,
  checkUnitHasActiveContract,
  createContract,
  updateContract,
  terminateContract,
  deleteContract
} = require('../models/contractModel');
const { findUnitByBuildingAndNumber } = require('../models/unitModel');
const { findTenantByNameAndPhone } = require('../models/tenantModel');

async function getContracts(req, res) {
  try {
   const contracts = await getAllContracts();
   res.json(contracts);
  } catch (err) {
   console.error(err);
   res.status(500).json({ error: 'Internal server error' });
  }
}

async function getContract(req, res) {
  try {
    const contract = await getContractById(req.params.id);
     if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
     }
      res.json(contract);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function addContract(req, res) {
  try {
   const { buildingName, unitNumber, tenantName, tenantPhone, startDate, endDate, rentAmount, paymentFrequency } = req.body;

   if (!buildingName || !unitNumber || !tenantName || !tenantPhone || !startDate || !endDate || !rentAmount || !paymentFrequency) {
    return res.status(400).json({ error: 'All fields are required' });
   }

    const unit = await findUnitByBuildingAndNumber(buildingName, unitNumber);
    if (!unit) {
        return res.status(404).json({ error: 'Unit not found in this building' });
    }

    const tenant = await findTenantByNameAndPhone(tenantName, tenantPhone);
    if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found. Make sure name and phone match exactly' });
    }

    const existingActive = await checkUnitHasActiveContract(unit.unit_id);
    if (existingActive) {
        return res.status(409).json({ error: 'This unit already has an active contract' });
    }

    const newContract = await createContract(unit.unit_id, tenant.tenant_id, startDate, endDate, rentAmount, paymentFrequency);
    res.status(201).json(newContract);
    } catch (err) {
    console.error(err);
    if (err.code === '23514') {
        return res.status(400).json({ error: 'Invalid data: check dates or rent amount' });
    }
    res.status(500).json({ error: 'Internal server error' });
    }
}

async function editContract(req, res) {
    try {
    const { startDate, endDate, rentAmount, paymentFrequency, status } = req.body;
    const updated = await updateContract(req.params.id, startDate, endDate, rentAmount, paymentFrequency, status);
    if (!updated) {
        return res.status(404).json({ error: 'Contract not found' });
    }
    res.json(updated);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
    }
}

async function endContract(req, res) {
  try {
      const terminated = await terminateContract(req.params.id);
      if (!terminated) {
          return res.status(404).json({ error: 'Contract not found' });
      }
      res.json({ message: 'Contract terminated, unit is now vacant', contract: terminated });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function removeContract(req, res) {
  try {
      const deleted = await deleteContract(req.params.id);
      if (!deleted) {
          return res.status(404).json({ error: 'Contract not found' });
      }
      res.json({ message: 'Contract deleted successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { 
  getContracts, 
  getContract, 
  addContract, 
  editContract, 
  endContract, 
  removeContract 
};