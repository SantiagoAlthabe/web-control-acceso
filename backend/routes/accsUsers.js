const express = require('express');
const router = express.Router();
const accsUsersController = require('../controllers/accsUsersController');

router.get('/exists', accsUsersController.checkExists); 
router.get('/', accsUsersController.getAllAccsUsers);
router.post('/', accsUsersController.createAccsUser);
router.get('/:id', accsUsersController.getAccsUserById);
router.put('/:id', accsUsersController.updateAccsUser);
router.delete('/:id', accsUsersController.deleteAccsUser);

module.exports = router;
