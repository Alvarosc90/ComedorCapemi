const express = require('express');
const router = express.Router();

// Importar el controlador de usuarios
const userController = require('../controllers/userController');

// Rutas para las operaciones de usuario
router.get('/', userController.getAllUsers);  // Obtener todos los usuarios
router.get('/:id', userController.getUserById);  // Obtener un usuario por ID
router.post('/', userController.createUser);  // Crear un nuevo usuario
router.put('/:id', userController.updateUser);  // Actualizar un usuario
router.delete('/:id', userController.deleteUser);  // Eliminar un usuario
router.post('/login', userController.loginUser);  // Aquí se llama al controlador

module.exports = router;
