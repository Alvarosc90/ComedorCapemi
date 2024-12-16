const { Sequelize } = require('sequelize');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

// Crea una nueva instancia de Sequelize con la configuración de tu base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,  // Dirección del servidor de la base de datos
    dialect: 'mssql',           // Especifica que estamos usando SQL Server
    dialectOptions: {
      options: {
        encrypt: true,  // Se recomienda habilitar el cifrado si estás usando conexiones seguras
        trustServerCertificate: true  // Permitir el uso de certificados autofirmados
      }
    },
    logging: console.log  // Desactivar el logging SQL si no lo necesitas
  }
);

// Prueba la conexión para asegurarte de que todo esté bien configurado
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida.');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

module.exports = sequelize;
