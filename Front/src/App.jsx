import './App.css';
import React, { useState } from 'react';
import { UserProvider } from '../context/UserContext'; // Asegúrate de tener el UserContext configurado
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Importar Router y Routes
import Home from './components/Home'; // Asegúrate de tener el componente Login en el mismo directorio o ajusta la ruta
import Menu from './components/Menu'; // Importa el componente Menu
import ABMItemPedidos from './components/ABMItemPedidos'; // Importa el componente ABMItemPedidos
import Consulta from './components/ConsultarPedidos'; // Importa el componente ConsultarPedidos
import Login from './components/LoginMain'; // Asegúrate de que el componente Login esté correctamente importado

function App() {
  return (
    <UserProvider> {/* Envuelve la aplicación con el UserProvider */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} /> {/* Ruta para el Login */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/abm-item-pedidos" element={<ABMItemPedidos />} /> {/* Ruta para agregar items */}
            <Route path="/consulta" element={<Consulta />} /> {/* Cambia /cocina por /consulta */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
