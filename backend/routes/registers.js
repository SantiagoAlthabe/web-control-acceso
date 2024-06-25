const express = require('express');
const router = express.Router();
const registersController = require('../controllers/registersController');

router.get('/', registersController.getAllRegisters);
router.post('/', registersController.createRegister);

module.exports = router;
