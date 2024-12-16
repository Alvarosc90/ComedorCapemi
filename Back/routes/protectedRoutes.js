const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');

// Ruta accesible por cualquier usuario autenticado
router.get('/perfil', authenticateToken, (req, res) => {
  res.status(200).json({ message: `Bienvenido, usuario con legajo ${req.user.legajo}` });
});

// Ruta solo para administradores
router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Acceso permitido: sección de administrador' });
});

module.exports = router;
