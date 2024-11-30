const express = require('express');
const {
    handleReportQuery
} = require('../controllers/controllerReporte'); 

const router = express.Router();

router.get('/reporte', handleReportQuery);

module.exports = router;