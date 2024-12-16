const Menu = require('../models/Menu'); // Importa el modelo

// Obtener todos los ítems del menú
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un ítem del menú por ID
exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Ítem no encontrado' });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo ítem en el menú
exports.createMenuItem = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    console.log('Datos recibidos:', { nombre, descripcion, precio });

    if (!nombre || !precio) {
      return res.status(400).json({ message: 'Nombre y precio son requeridos' });
    }

    const newMenuItem = await Menu.create({ nombre, descripcion, precio });
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error('Error al crear el ítem del menú:', error);
    res.status(500).json({ error: error.message });
  }
};


// Actualizar un ítem del menú
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;

    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ message: 'Ítem no encontrado' });
    }

    await menu.update({ nombre, descripcion, precio });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un ítem del menú
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ message: 'Ítem no encontrado' });
    }

    await menu.destroy();
    res.status(204).send(); // Respuesta sin contenido
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
