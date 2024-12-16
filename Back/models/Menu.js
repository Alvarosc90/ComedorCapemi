//Menu.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');  // Asegúrate de que esta ruta sea correcta

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Esto genera un id autoincremental
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,  // No se puede dejar vacío
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,  // No se puede dejar vacío
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,  // No se puede dejar vacío
  },
}, {
  tableName: 'Menu',  // Asegúrate de que coincida con el nombre de la tabla en tu base de datos
  timestamps: false,  // Para no generar campos 'createdAt' y 'updatedAt'
});

module.exports = Menu;

