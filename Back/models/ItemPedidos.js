const { DataTypes } = require('sequelize');
const sequelize = require('../database/config'); // Asegúrate de que la ruta esté correcta
const User = require('../models/User.js'); // Importar el modelo de User

const ItemPedidos = sequelize.define('ItemPedidos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  legajo: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'legajo',
    },
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false, // La cantidad no puede ser nula
    validate: {
      min: 1, // Debe ser al menos 1
    },
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  menu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'ItemPedidos', // Nombre de la tabla en la base de datos
});

// Establecer la relación con User
ItemPedidos.belongsTo(User, { foreignKey: 'legajo', targetKey: 'legajo' });

module.exports = ItemPedidos;
