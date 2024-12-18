// protectedRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');

// Ruta accesible solo por administradores
router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Acceso permitido: sección de administrador' });
});

module.exports = router;
