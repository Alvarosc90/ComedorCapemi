//itemPedidos.js
const express = require('express');
const router = express.Router();
const { createItemPedido, getAllItemPedidos, getItemPedidosByLegajo, deleteItemPedido } = require('../controllers/ItemPedidosController');

// Crear un nuevo ítem de pedido
router.post('/', createItemPedido);

// Obtener todos los ítems de pedidos
router.get('/', getAllItemPedidos);

// Obtener los ítems de un usuario por legajo
router.get('/legajo/:legajo', getItemPedidosByLegajo);

// Eliminar un ítem de pedido por ID
router.delete('/:id', deleteItemPedido);

module.exports = router;
