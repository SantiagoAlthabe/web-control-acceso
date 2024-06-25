const express = require('express');
const router = express.Router();
const platformUsersController = require('../controllers/platformUsersController');

router.get('/', platformUsersController.getAllPlatformUsers);
router.post('/', platformUsersController.createPlatformUser);

// Otros endpoints para actualizar y eliminar

module.exports = router;
