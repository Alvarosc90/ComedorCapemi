const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');  // Asegúrate de que la ruta esté correcta

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  legajo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, { timestamps: false, tableName: 'Usuarios' });

// Asegúrate de que estás exportando correctamente el modelo
module.exports = User;
