//loginController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Asegúrate de importar tu modelo de usuario

// 1. Autenticación con legajo
exports.loginWithLegajo = async (req, res) => {
  try {
    const { legajo } = req.body;

    console.log(`Intentando login con legajo: ${legajo}`);

    // Buscar al usuario por su legajo
    const user = await User.findOne({ where: { legajo } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear el token JWT (sin necesidad de verificar contraseña)
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Payload
      process.env.JWT_SECRET,              // Clave secreta
      { expiresIn: '1h' }                  // Tiempo de expiración
    );

    // Responder con éxito
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        legajo: user.legajo,
        apellido: user.apellido,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginWithLegajoPassword = async (req, res) => {
  try {
    console.log('Cuerpo recibido en el backend:', req.body);
    const { legajo, password } = req.body;

    if (!legajo || !password) {
      return res.status(400).json({ message: 'Faltan parámetros legajo o password' });
    }

    const user = await User.findOne({ where: { legajo } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.json({ success: true, message: 'Login exitoso', user });
  } catch (error) {
    console.error('Error en el backend:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

