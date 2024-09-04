const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Rutas de autenticación
router.post('/register', registerUser); // Registro de usuario
router.post('/login', loginUser); // Inicio de sesión

module.exports = router;
