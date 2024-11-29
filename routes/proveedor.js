const express = require('express');
const {
    getProveedor,
    addProveedor,
    updateProveedor,
    deleteProveedor,
} = require('../controllers/controllerProveedor');

const router = express.Router();


router.get('/proveedor', getProveedor);
router.post('/proveedor', addProveedor);
router.put('/proveedor/:id', updateProveedor);
router.delete('/proveedor/:id', deleteProveedor);

module.exports = router;