const ItemPedidos = require('../models/ItemPedidos');

// Crear un nuevo ítem de pedido
const createItemPedido = async (req, res) => {
  const { legajo, total, fecha, menu, cantidad } = req.body;

  console.log("Datos recibidos en el backend para ItemPedido:", req.body); // Ver los datos recibidos

  try {
    const nuevoItemPedido = await ItemPedidos.create({
      legajo,
      total,
      fecha,
      menu,
      cantidad, // Incluir cantidad
    });

    res.status(201).json({
      message: 'Ítem de pedido creado correctamente',
      itemPedido: nuevoItemPedido
    });
  } catch (error) {
    console.error('Error al crear el ítem de pedido:', error);
    res.status(500).json({ message: 'Error al crear el ítem de pedido' });
  }
};

// Obtener todos los ítems de pedidos
const getAllItemPedidos = async (req, res) => {
  try {
    const items = await ItemPedidos.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error al obtener los ítems de pedido:', error);
    res.status(500).json({ message: 'Error al obtener los ítems de pedido' });
  }
};

// Obtener los ítems de un usuario específico por legajo
const getItemPedidosByLegajo = async (req, res) => {
  const { legajo } = req.params;

  try {
    const items = await ItemPedidos.findAll({
      where: { legajo }
    });

    if (!items.length) {
      return res.status(404).json({ message: 'No se encontraron ítems de pedido para este legajo' });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error('Error al obtener los ítems de pedido por legajo:', error);
    res.status(500).json({ message: 'Error al obtener los ítems de pedido por legajo' });
  }
};

// Eliminar un ítem de pedido
const deleteItemPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await ItemPedidos.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Ítem de pedido no encontrado' });
    }

    await item.destroy();
    res.status(200).json({ message: 'Ítem de pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el ítem de pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el ítem de pedido' });
  }
};

module.exports = {
  createItemPedido,
  getAllItemPedidos,
  getItemPedidosByLegajo,
  deleteItemPedido
};
