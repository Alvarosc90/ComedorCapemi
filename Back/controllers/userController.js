//userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por su ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { nombre, legajo, email, password, role } = req.body;

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      nombre,
      legajo,
      email,
      password: hashedPassword,  // Guardamos la contraseña encriptada
      role,
    });

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, legajo, email, password, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los detalles del usuario
    user.nombre = nombre || user.nombre;
    user.legajo = legajo || user.legajo;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;

    // Si la contraseña fue actualizada, encriptarla
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: 'Usuario actualizado correctamente',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();

    res.json({
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  // Login de usuario (actualizado para usar dni)
exports.loginUser = async (req, res) => {
  try {
    const { dni, password } = req.body;

    // Verificar si el usuario existe usando el dni
    const user = await User.findOne({ where: { dni } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar las contraseñas
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Crear un token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ message: 'Login exitoso', token });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

