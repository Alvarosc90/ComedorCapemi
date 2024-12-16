import { createContext, useContext, useState, useEffect } from 'react';

// Crea el contexto de usuario
const UserContext = createContext();

// El proveedor que envuelve a la aplicación con el contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ legajo: null, nombre: null, apellido: null, isLoggedIn: false });


  useEffect(() => {
    const savedLegajo = localStorage.getItem('legajo');
    const savedNombre = localStorage.getItem('nombre');
    const savedApellido = localStorage.getItem('apellido');
    if (savedLegajo && savedNombre) {
      setUser({ legajo: savedLegajo, nombre: savedNombre,apellido: savedApellido, isLoggedIn: true });
    }
  }, []);

  const login = (legajo, nombre, apellido) => {
    setUser({ legajo, nombre, apellido, isLoggedIn: true });
    localStorage.setItem('legajo', legajo);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('apellido', apellido);
  };
  
  const logout = () => {
    setUser({ legajo: '', nombre: '',apellido:'', isLoggedIn: false });
    localStorage.removeItem('legajo');
    localStorage.removeItem('nombre');
   // localStorage.removeItem('token');
    localStorage.removeItem('apellido');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Crea un custom hook para acceder al contexto de usuario
export const useUser = () => {
  return useContext(UserContext);
};
