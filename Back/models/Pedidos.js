const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');  // Asegúrate de que la ruta esté correcta
const User = require('./User');  // Importar el modelo de User

const Pedidos = sequelize.define('Pedidos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  legajo: {
    type: DataTypes.STRING,
    references: {
      model: User,  // Relación con la tabla 'User'
      key: 'legajo',
    },
    allowNull: false,
  },  
  menu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  realizado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  // Por defecto será false (no realizado)
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'Pedidos',
});

// Establecer la relación con User
Pedidos.belongsTo(User, { foreignKey: 'legajo', targetKey: 'legajo' });

module.exports = Pedidos;
