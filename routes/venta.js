const express = require('express');
const {
    obtenerVentas,
    crearVenta
} = require('../controllers/controllerVenta');
const router = express.Router();



router.get('/venta', obtenerVentas);
router.post('/venta', crearVenta);

module.exports = router;
