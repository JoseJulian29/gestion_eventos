const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token proporcionado.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Almacenar la información del usuario verificado en req.user
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });
  }
};

module.exports = authMiddleware;
