//Routes pedidos.js

const express = require('express');
const router = express.Router();
const { createPedido, getAllPedidos, getPedidosByLegajo, updatePedido } = require('../controllers/pedidosController.js');
const Pedidos = require('../models/Pedidos');  // Ruta correcta dependiendo de tu estructura de directorios

// Crear un nuevo pedido
router.post('/', createPedido);

// Obtener todos los pedidos
router.get('/', getAllPedidos);

// Obtener los pedidos de un usuario por legajo
router.get('/legajo/:legajo', getPedidosByLegajo);

// Actualizar un pedido por ID
router.put('/:id', updatePedido);

// Eliminar todos los pedidos
router.delete('/', async (req, res) => {
  try {
    // Eliminar todos los pedidos del día (opcional: agregar un filtro de fecha si se quiere limitar solo a los pedidos del día)
    await Pedidos.destroy({
      where: {}, // Si necesitas filtrar por fecha, usa un where adecuado aquí
    });

    res.status(200).json({ message: 'Todos los pedidos han sido eliminados' });
  } catch (error) {
    console.error('Error al eliminar los pedidos:', error);
    res.status(500).json({ message: 'Error al eliminar los pedidos' });
  }
});


module.exports = router;
