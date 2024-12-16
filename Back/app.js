//app.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./database/config'); // Asegúrate de que sequelize esté configurado correctamente
require('dotenv').config();

// Importar rutas
const userRoutes = require('./routes/userRoutes.js');
const menuRoutes = require('./routes/menuRoutes');
const pedidosRoutes = require('./routes/pedidos');
const loginRoutes = require('./routes/login');  // Asegúrate de que apunte correctamente a tu archivo de rutas
const protectedRoutes = require('./routes/protectedRoutes');
const itemPedidoRouter = require ('./routes/itemPedidos');


const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/itemPedidos', itemPedidoRouter);
app.use('/users', userRoutes);   // Rutas de usuarios
app.use('/menus', menuRoutes);   // Rutas de menús
app.use('/pedidos', pedidosRoutes);  // Nueva ruta de pedidos
app.use('/login', loginRoutes);  // Ajusta la ruta de login para que esté accesible en /login
app.use('/api', protectedRoutes);


// Sincronizar base de datos
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
