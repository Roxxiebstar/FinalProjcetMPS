const express = require('express');
const {
    getCliente,
    addCliente,
    updateCliente,
    deleteCliente,
} = require('../controllers/controllerCliente');

const router = express.Router();


router.get('/cliente', getCliente);
router.post('/cliente', addCliente);
router.put('/cliente/:id', updateCliente);
router.delete('/cliente/:id', deleteCliente);

module.exports = router;