const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Rutas de autenticación
router.post('/register', registerUser); // Registro de usuario
router.post('/login', loginUser); // Inicio de sesión
router.get('/me', authMiddleware, getCurrentUser); // Obtener información del usuario actual (requiere autenticación)

module.exports = router;
