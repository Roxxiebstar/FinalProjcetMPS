const express = require('express');
const {
    getMueble,
    addMueble,
    updateMueble,
    deleteMueble,
} = require('../controllers/controllerMueble');

const router = express.Router();


router.get('/mueble', getMueble);
router.post('/mueble', addMueble);
router.put('/mueble/:id', updateMueble);
router.delete('/mueble/:id', deleteMueble);

module.exports = router;