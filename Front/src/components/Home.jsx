import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';  // Importa la configuración de axios
import "../css/home.css";
import { useUser } from '../../context/UserContext';

function Home() {
  const [legajo, setLegajo] = useState('');
  const [error, setError] = useState('');
  const [accessType, setAccessType] = useState('');
  const navigate = useNavigate();
  
  const { login, logout } = useUser();
  
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    // Redirigir a /login si no hay token
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAccessTypeChange = (type) => {
    setError('');
    setLegajo('');
    setAccessType(type);

    if (type === 'menu') {
      setShowLoginForm(true);
    } else {
      setShowLoginForm(false);
      if (type === 'consulta') {
        navigate('/consulta');
      } else if (type === 'abm') {
        navigate('/abm-item-pedidos');
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!legajo) {
      setError('Por favor, ingresa tu legajo');
      return;
    }

    try {
      const payload = { legajo };
      const response = await axios.post('/login/legajo', payload);

      if (response.data.success) {
        const { user, token } = response.data;
        
        login(user.legajo, user.nombre, user.apellido);
        localStorage.setItem('token', token);

        navigate('/menu');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error al hacer login', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error de conexión';
      setError(`Error del servidor: ${errorMsg}`);
    }
  };

  const handleLogout = () => {
    // Limpiar los datos de localStorage
    localStorage.removeItem('token');
    // Limpiar el contexto de usuario
    logout();
    // Redirigir a la página de login
    navigate('/login');
  };

  return (
    <div className='login-main'>
      <img className='fondocapemi3' src="./fondo.png" alt="Capemi" />
      <img className='fondocapemi2' src="./fondo.png" alt="Capemi" />
      <div className="login__title1">
        <h1 className='logintitle__h1'>Bienvenido al Comedor Virtual de</h1>
        <img className='CAPEMI' src="./fondo2.png" alt="capemi1" />
        <h3 className="login__title2">Seleccione una opcion</h3>
        {error && <div className="login__error">{error}</div>}

        <div className="login__access-buttons">
          <button className="login__button" onClick={() => handleAccessTypeChange('consulta')}>
            Consultar Pedidos
          </button>
          <button className="login__button" onClick={() => handleAccessTypeChange('menu')}>
            Acceder al Menú
          </button>
          <button className="login__button" onClick={() => handleAccessTypeChange('abm')}>
            Cargar Producto
          </button>
        </div>

        {showLoginForm && (
          <form className="login__form" onSubmit={handleLoginSubmit}>
            <div className="login__form-group">
              <label className="login__label">Legajo:</label>
              <input
                className="login__input"
                type="text"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
                placeholder="Ingresa tu legajo"
              />
            </div>

            <button className="login__submit-button" type="submit">
              Ir al Menú
            </button>
          </form>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Home;
