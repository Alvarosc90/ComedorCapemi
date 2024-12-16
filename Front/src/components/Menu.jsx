import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Menu.css';
import api from '../../axiosConfig';
import { DateTime } from 'luxon';

const Menu = () => {
  const navigate = useNavigate();
  const [legajo, setLegajo] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cantidad, setCantidad] = useState({}); // Estado para las cantidades de los productos
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLegajo = localStorage.getItem('legajo');
    const storedNombre = localStorage.getItem('nombre');
    const storedApellido = localStorage.getItem('apellido');

    if (storedLegajo && storedNombre && storedApellido) {
      setLegajo(storedLegajo);
      setNombre(storedNombre);
      setApellido(storedApellido);
    } else {
      alert('No se encontró el usuario. Por favor, inicia sesión.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/menus');
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el menú:', error);
        alert('Error al conectar con el servidor.');
      }
    };

    fetchMenuItems();
  }, []);

  const handleCantidadChange = (itemId, change) => {
    // Usamos una función de actualización del estado para asegurarnos de que se mantenga inmutable
    setCantidad((prev) => {
      const newCantidad = (prev[itemId] || 0) + change; // Sumamos o restamos al valor actual
      if (newCantidad >= 0) {
        return { ...prev, [itemId]: newCantidad }; // Actualizamos la cantidad del ítem
      }
      return prev; // Si la cantidad es menor que 0, no hacemos nada
    });
  };

  const handleSolicitar = async () => {
    if (!legajo) {
      alert('No se pudo encontrar el legajo.');
      return;
    }

    const fechaFormateada = DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss');

    const itemPedido = menuItems.map((item) => {
      const cantidadItem = cantidad[item.id] || 0;
      return {
        menu: item.nombre,
        total: item.precio * cantidadItem,
        cantidad: cantidadItem,
      };
    });

    const pedidoFinal = itemPedido.filter((item) => item.cantidad > 0);

    if (pedidoFinal.length > 0) {
      try {
        let totalCantidad = 0;

        const menuFormateado = pedidoFinal
          .map((item) => `${item.menu}:${item.cantidad}`)
          .join(', ');

        for (const pedido of pedidoFinal) {
          totalCantidad += pedido.cantidad;
          const itemPedidoData = {
            legajo,
            total: pedido.total,
            fecha: fechaFormateada,
            menu: pedido.menu,
            cantidad: pedido.cantidad,
          };

          await api.post('/itemPedidos', itemPedidoData);
        }

        const pedidoData = {
          legajo,
          menu: menuFormateado,
          realizado: false,
          fecha: fechaFormateada,
          cantidad: totalCantidad,
        };

        const responsePedido = await api.post('/pedidos', pedidoData);

        if (responsePedido.status === 201) {
          alert('¡Pedido realizado con éxito!');
          navigate('/');
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

  const handleCancelar = () => {
    navigate('/');
  };

  if (loading) {
    return <p>Cargando menú...</p>;
  }

  return (
    <div className="menu-container">
      <h2>Menú de Comidas</h2>

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
              <button
                onClick={() => handleCantidadChange(item.id, -1)}
                className="quantity-button"
                disabled={cantidad[item.id] <= 0}
              >
                -
              </button>
              <span className="quantity-display">
                {cantidad[item.id] || 0}
              </span>
              <button
                onClick={() => handleCantidadChange(item.id, 1)}
                className="quantity-button"
              >
                +
              </button>
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
