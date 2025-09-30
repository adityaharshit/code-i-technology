const express = require("express");
const router = express.Router();
const verifyCertificateController = require('../controllers/verifyCertificateController');

router.get('/:certNumber', verifyCertificateController.getCertificateInformation);

module.exports = router;