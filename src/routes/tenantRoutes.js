const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
    getTenants,
    getTenant,
    addTenant,
    editTenant,
    removeTenant
} = require('../controllers/tenantController');

router.get('/', authenticate, getTenants);
router.get('/:id', authenticate, getTenant);

router.post('/', authenticate, authorize('owner', 'admin'), addTenant);
router.put('/:id', authenticate, authorize('owner', 'admin'), editTenant);

router.delete('/:id', authenticate, authorize('owner'), removeTenant);

module.exports = router;