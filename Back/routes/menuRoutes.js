//menuRoutes.js
const express = require('express');
const router = express.Router();

// Importar el controlador de menú
const menuController = require('../controllers/menuController');

// Rutas para las operaciones de menú
router.get('/', menuController.getAllMenus); // Obtener todos los ítems del menú
router.get('/:id', menuController.getMenuById); // Obtener un ítem del menú por ID
router.post('/', menuController.createMenuItem); // Crear un nuevo ítem en el menú
router.put('/:id', menuController.updateMenuItem); // Actualizar un ítem del menú
router.delete('/:id', menuController.deleteMenuItem); // Eliminar un ítem del menú
router.post('/login', (req, res) => {
    const { legajo } = req.body;
  
    // Validar que legajo esté presente
    if (!legajo) {
      return res.status(400).json({ message: 'Legajo es requerido' });
    }
  
    // Aquí no deberías requerir 'Nombre' ni 'Precio'
    // Lógica para procesar el acceso al menú (verificar el legajo)
    res.status(200).json({ success: true });
  });
  
module.exports = router;
