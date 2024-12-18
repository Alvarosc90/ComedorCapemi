import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Usa el hook del contexto
import axios from '../../axiosConfig'; // Asegúrate de que la configuración de axios esté correcta
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa los íconos de ojo
import '../css/LoginMain.css';

function LoginMain() {
  const { login } = useUser(); // Obtén la función login desde el contexto
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar la visibilidad de la contraseña
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!legajo || !password) {
      setError('Por favor, ingresa tu legajo y contraseña');
      return;
    }

    try {
      const response = await axios.post('/login/password', { legajo, password });
      console.log('Respuesta del servidor:', response.data); // Verifica que el token y los datos sean correctos

      if (response.data.success) {
        const { token, nombre, apellido } = response.data; // Asegúrate de que la respuesta tenga estos datos

        if (!token) {
          throw new Error('No se recibió token en la respuesta del servidor');
        }

        // Guardar token en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('legajo', legajo);
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);
        console.log('Token almacenado en localStorage:', token);

        // Utiliza el contexto para actualizar el estado del usuario
        login(legajo, nombre, apellido);

        // Redirige al usuario
        navigate('/'); // O la ruta que desees
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error al hacer login:', err);
      setError('Hubo un error en el servidor o no se pudo autenticar');
    }
  };

  return (
    <div className='login-container'>
  <div className="login-form">
    <h2>Login</h2>
    {error && <div className="error-message">{error}</div>}
    <form className='form___login' onSubmit={handleLoginSubmit}>
      <div>
        <label>Legajo:</label>
        <input
          type="text"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
          placeholder="Ingrese su legajo"
        />
      </div>
      <div className="password-field">
        <label>Contraseña:</label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingrese su contraseña"
        />
        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <button className='button__login' type="submit">Iniciar sesión</button>
    </form>
  </div>
</div>




  );
}

export default LoginMain;
