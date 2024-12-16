import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../css/Menu.css';
import api from '../../axiosConfig'; // Importar la configuración de axios
import { DateTime } from 'luxon'; // Importar Luxon correctamente

const Menu = () => {
  const navigate = useNavigate(); // Inicializar el hook useNavigate
  const [legajo, setLegajo] = useState(null); // Estado para el legajo
  const [nombre, setNombre] = useState(''); // Estado para el nombre
  const [apellido, setApellido] = useState(''); // Estado para el apellido
  const [cantidad, setCantidad] = useState({}); // Estado para las cantidades de los productos
  const [menuItems, setMenuItems] = useState([]); // Estado para los ítems del menú
  const [loading, setLoading] = useState(true); // Para manejar la carga de los datos

  // Obtener los datos del usuario desde localStorage cuando se monte el componente
  useEffect(() => {
    const storedLegajo = localStorage.getItem('legajo');
    const storedNombre = localStorage.getItem('nombre');
    const storedApellido = localStorage.getItem('apellido');

    if (storedLegajo && storedNombre && storedApellido) {
      setLegajo(storedLegajo); // Si se encuentra el legajo, lo almacena en el estado
      setNombre(storedNombre); // Almacena el nombre
      setApellido(storedApellido); // Almacena el apellido
    } else {
      alert('No se encontró el usuario. Por favor, inicia sesión.');
      navigate('/login'); // Redirige al login si no encuentra los datos
    }
  }, [navigate]);

  // Obtener el menú desde la API al cargar el componente
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/menus'); // Usar la configuración de Axios
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el menú:', error);
        alert('Error al conectar con el servidor.');
      }
    };

    fetchMenuItems();
  }, []);

  // Función para manejar el cambio de cantidad
  const handleCantidadChange = (e, itemId) => {
    const newCantidad = { ...cantidad, [itemId]: e.target.value };
    setCantidad(newCantidad);
  };

  // Función para manejar el envío del pedido
  const handleSolicitar = async () => {
    if (!legajo) {
      alert('No se pudo encontrar el legajo.');
      return;
    }
  
    // Obtener la fecha actual usando Luxon (formato ISO)

    const fechaFormateada = DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss');  // Sin zona horaria

    const itemPedido = menuItems.map((item) => ({
      menu: item.nombre,
      total: item.precio * (parseInt(cantidad[item.id] || 0, 10)),
      cantidad: parseInt(cantidad[item.id] || 0, 10),
    }));
  
    const pedidoFinal = itemPedido.filter((item) => item.cantidad > 0);
  
    if (pedidoFinal.length > 0) {
      try {
        let totalCantidad = 0; // Para almacenar la cantidad total del pedido
  
        // Grabar en la tabla ItemPedidos
        for (const pedido of pedidoFinal) {
          totalCantidad += pedido.cantidad; // Sumar la cantidad de cada ítem
          const itemPedidoData = {
            legajo,
            total: pedido.total,
            fecha: fechaFormateada,
            menu: pedido.menu,
            cantidad: pedido.cantidad, // Incluir cantidad
          };
  
          await api.post('/itemPedidos', itemPedidoData);
        }
  
        // Grabar en la tabla Pedidos
        const pedidoData = {
          legajo,
          menu: pedidoFinal.map((item) => item.menu).join(', '),
          realizado: false, // Por defecto no realizado
          fecha: fechaFormateada,
          cantidad: totalCantidad, // Registrar la cantidad total
        };
  
        const responsePedido = await api.post('/pedidos', pedidoData);
  
        if (responsePedido.status === 201) {
          alert('¡Pedido realizado con éxito!');
          navigate('/'); // Redirigir al home
        } else {
          alert('Hubo un error al registrar el pedido.');
        }
      } catch (error) {
        console.error('Error al enviar el pedido:', error);
        alert('Hubo un error con la conexión al servidor.');
      }
    } else {
      alert('Por favor, selecciona al menos un ítem.');
    }
  };
  
  

  // Función para manejar el cancelamiento
  const handleCancelar = () => {
    navigate('/'); // Redirigir al home si se cancela
  };

  if (loading) {
    return <p>Cargando menú...</p>; // Puedes agregar un spinner si prefieres
  }

  return (
    <div className="menu-container">
      <h2>Menú de Comidas</h2>

      {/* Mostrar los datos del usuario logueado */}
      <div className="user-info">
        <p>
          <strong>Legajo:</strong> {legajo}
        </p>
        <p>
          <strong>Nombre:</strong> {nombre} {apellido}
        </p>
      </div>

      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <h3>{item.nombre}</h3>
            <p>{item.descripcion}</p>
            <p className="price">${item.precio.toFixed(2)}</p>
            <div className="quantity">
              <label>Cantidad:</label>
              <input
                type="number"
                min="0"
                value={cantidad[item.id] || 0}
                onChange={(e) => handleCantidadChange(e, item.id)}
                className="quantity-input"
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSolicitar} className="solicitar-button">
        Solicitar
      </button>

      <button onClick={handleCancelar} className="cancelar-button">
        Cancelar
      </button>
    </div>
  );
};

export default Menu;
