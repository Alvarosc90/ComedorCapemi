import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';  // Importa la configuración de axios
import "../css/Login.css";
import { useUser } from '../../context/UserContext';

function Login() {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [accessType, setAccessType] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useUser();

  const handleAccessTypeChange = (type) => {
    setAccessType(type);
    setError('');
    setLegajo('');
    setPassword('');

    // Redirigir directamente si se seleccionó "consulta"
    if (type === 'consulta') {
      navigate('/consulta');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validación básica para "abm", pero no para "menu" ni "consulta"
    if ((accessType === 'abm' && !legajo) || (accessType === 'menu' && !legajo)) {
      setError('Por favor, ingresa tu legajo');
      return;
    }

    // Si es ABM, también validamos la contraseña
    if (accessType === 'abm' && !password) {
      setError('Por favor, ingresa tu contraseña');
      return;
    }

    try {
      let endpoint = '';
      let payload = { legajo };

      // Determinar el endpoint y el payload según el tipo de acceso
      if (accessType === 'abm') {
        endpoint = '/login/password';
        payload.password = password;
      } else if (accessType === 'menu') {
        endpoint = '/login/legajo';
      }

      const response = await axios.post(endpoint, payload);

      if (response.data.success) {
        const { user, token } = response.data;
  
        login(user.legajo, user.nombre, user.apellido);
        localStorage.setItem('token', token); // Almacenar el token
        navigate(
          accessType === 'menu' ? '/menu' : '/abm-item-pedidos'
        );
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error al hacer login', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error de conexión';
      setError(`Error del servidor: ${errorMsg}`);
    }
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

        {/* Solo mostrar formulario si no es 'consulta' */}
        {(accessType === 'menu' || accessType === 'abm') && (
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

            {accessType === 'abm' && (
              <div className="login__form-group">
                <label className="login__label">Contraseña:</label>
                <input
                  className="login__input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                />
              </div>
            )}

            <button className="login__submit-button" type="submit">
              {accessType === 'consulta' ? 'Consultar Pedidos' :
                accessType === 'menu' ? 'Ir al Menú' : 'Acceder'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;