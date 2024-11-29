const express = require('express');
const {
    getVendedores,
    addVendedor,
    updateVendedor,
    deleteVendedor,
} = require('../controllers/controllerVendedor'); // Importar controladores

const router = express.Router();


router.get('/vendedor', getVendedores);
router.post('/vendedor', addVendedor);
router.put('/vendedor/:id', updateVendedor);
router.delete('/vendedor/:id', deleteVendedor);

module.exports = router;
