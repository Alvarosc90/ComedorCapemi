const express = require('express');
const router = express.Router();
const { loginWithLegajo, loginWithLegajoPassword } = require('../controllers/loginController');  // Controladores de login

router.post('/legajo', loginWithLegajo);
router.post('/password', loginWithLegajoPassword);


module.exports = router;
