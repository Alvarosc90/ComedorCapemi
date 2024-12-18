import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UserProvider } from '../../Front/context/UserContext.jsx'; // Asegúrate de que la ruta sea correcta

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>  {/* Envuelve App con UserProvider */}
      <App />
    </UserProvider>
  </StrictMode>
);