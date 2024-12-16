const Pedidos  = require('../models/Pedidos');
const User = require('../models/User');  // Asegúrate de importar el modelo de User

// Crear un nuevo pedido
const createPedido = async (req, res) => {
  const { legajo, menu, cantidad, } = req.body;
  
  console.log('Datos recibidos en crear pedido:', req.body);

  try {
    const nuevoPedido = await Pedidos.create({
      legajo,
      menu,
      realizado: false,  // Por defecto no realizado
      fecha: new Date(),  // Fecha actual
      cantidad,
    });

    console.log('Pedido creado correctamente:', nuevoPedido);

    res.status(201).json({
      message: 'Pedido creado correctamente',
      pedido: nuevoPedido
    });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
};



const getAllPedidos = async (req, res) => {
  try {
    const { legajo } = req.query;

    // Obtener todos los pedidos, filtrados por legajo si se pasa en la query
    const pedidos = await Pedidos.findAll({
      where: legajo ? { legajo } : {}, // Filtrar por legajo si está presente
      include: [{
        model: User,
        attributes: ['nombre', 'apellido'], // Obtener solo los atributos necesarios de User
      }],
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
};


// Obtener los pedidos de un usuario específico por legajo
const getPedidosByLegajo = async (req, res) => {
  const { legajo } = req.params;

  try {
    const pedidos = await Pedidos.findAll({
      where: { legajo }
    });

    if (!pedidos.length) {
      return res.status(404).json({ message: 'No se encontraron pedidos para este legajo' });
    }

    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos por legajo:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos por legajo' });
  }
};

const updatePedido = async (req, res) => {
  const { id } = req.params;
  const { legajo, menu, realizado, cantidad } = req.body; // Agregar cantidad en el destructuring

  try {
    const pedidoExistente = await Pedidos.findByPk(id);

    if (!pedidoExistente) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Actualizar los campos recibidos en el cuerpo de la solicitud
    pedidoExistente.legajo = legajo || pedidoExistente.legajo;
    pedidoExistente.menu = menu || pedidoExistente.menu;
    pedidoExistente.realizado = realizado !== undefined ? realizado : pedidoExistente.realizado;
    pedidoExistente.cantidad = cantidad !== undefined ? cantidad : pedidoExistente.cantidad; // Actualizar cantidad si se envía

    await pedidoExistente.save();

    res.status(200).json({
      message: 'Pedido actualizado correctamente',
      pedido: pedidoExistente,
    });
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el pedido' });
  }
};



module.exports = {
  createPedido,
  getAllPedidos,
  getPedidosByLegajo,
  updatePedido
};
