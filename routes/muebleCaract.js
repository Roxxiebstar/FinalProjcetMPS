const express = require('express');
const {
    getColor,
    getTipo,
    getMaterial
} = require('../controllers/controllerMuebleCaract');

const router = express.Router();


router.get('/muebleC', getColor);
router.get('/muebleM', getMaterial);
router.get('/muebleT', getTipo);

module.exports = router;