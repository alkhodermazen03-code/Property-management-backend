const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
    getContracts,
    getContract,
    addContract,
    editContract,
    endContract,
    removeContract
} = require('../controllers/contractController');

router.get('/', authenticate, getContracts);
router.get('/:id', authenticate, getContract);

router.post('/', authenticate, authorize('owner', 'admin'), addContract);
router.put('/:id', authenticate, authorize('owner', 'admin'), editContract);
router.patch('/:id/terminate', authenticate, authorize('owner', 'admin'), endContract);

router.delete('/:id', authenticate, authorize('owner'), removeContract);

module.exports = router;