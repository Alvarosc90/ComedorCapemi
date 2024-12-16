import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../css/ConsultarPedidos.css';

const ConsultarPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [legajo, setLegajo] = useState('');
  const [loading, setLoading] = useState(false);
  const [pedidoCounts, setPedidoCounts] = useState({});
  const navigate = useNavigate(); // Usamos useNavigate para la navegación

  // Función para obtener los pedidos desde el servidor
  const fetchPedidos = async (searchLegajo) => {
    setLoading(true);
    try {
      const response = await axios.get('/pedidos', {
        params: searchLegajo ? { legajo: searchLegajo } : {},
      });
      if (Array.isArray(response.data)) {
        setPedidos(response.data);
        updatePedidoCounts(response.data);
      } else {
        console.error('La respuesta no es un array:', response.data);
        setPedidos([]);
        setPedidoCounts({});
      }
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
      setPedidos([]);
      setPedidoCounts({});
    } finally {
      setLoading(false);
    }
  };


  // Función para actualizar el conteo de pedidos por tipo de opción
  const updatePedidoCounts = (pedidos) => {
    const counts = pedidos.reduce((acc, pedido) => {
      // Verificar si pedido.menu es una cadena y separarla por comas
      const opciones = pedido.menu ? pedido.menu.split(',').map(opcion => opcion.trim()) : [];

      // Si pedido.cantidad es un número, no necesitamos dividirlo
      const cantidades = Array.isArray(pedido.cantidad) ? pedido.cantidad : [pedido.cantidad]; // Asegurarse que cantidad es un arreglo de números

      // Contar cada opción considerando su cantidad
      opciones.forEach((opcion, index) => {
        const cantidad = cantidades[index] || 1; // Si no hay cantidad para una opción, usamos 1 por defecto
        acc[opcion] = (acc[opcion] || 0) + cantidad; // Sumar la cantidad correspondiente
      });

      return acc;
    }, {});

    setPedidoCounts(counts); // Guardar el conteo en el estado
  };



  // Actualizar el estado de "pedido_realizado"
  const handlePedidoRealizadoChange = async (id, currentStatus) => {
    try {
      // Cambiar el estado de "realizado" al contrario del valor actual
      const updatedRealizado = !currentStatus;

      // Actualizar el estado del pedido en el backend
      await axios.put(`/pedidos/${id}`, {
        realizado: updatedRealizado, // Enviar el nuevo valor de "realizado"
      });

      // Volver a cargar los pedidos para reflejar el cambio
      fetchPedidos(legajo);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  };

  // Efecto para cargar todos los pedidos al inicio
  useEffect(() => {
    fetchPedidos('');
  }, []);

  // Efecto para buscar pedidos al cambiar el valor de "legajo"
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPedidos(legajo);
    }, 500); // Esperar 500ms antes de realizar la búsqueda (evitar demasiadas solicitudes)

    return () => clearTimeout(timeoutId); // Limpiar el timeout si el legajo cambia antes de los 500ms
  }, [legajo]);

  // Función para limpiar todos los pedidos
  const handleClearPedidos = async () => {
    try {
      await axios.delete('/pedidos'); // Llamar al endpoint para eliminar todos los pedidos
      fetchPedidos(''); // Volver a cargar la lista vacía
    } catch (error) {
      console.error('Error al limpiar los pedidos:', error);
    }
  };

  return (
    <div className="consultar-pedidos-container">
      <h2>Consultar Pedidos</h2>

      {/* Mostrar los conteos de los pedidos por menú */}
      <div className="pedido-summary">
        <p><strong>Total de ítems pedidos:</strong> {Object.values(pedidoCounts).reduce((sum, count) => sum + count, 0)}</p>
        {Object.entries(pedidoCounts).map(([tipo, count]) => (
          <p key={tipo}><strong>{tipo}:</strong> {count} unidades</p>
        ))}
      </div>


      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por legajo"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <div className="pedidos-table-container">
          {pedidos.length === 0 ? (
            <p>No hay pedidos para mostrar.</p>
          ) : (
            <table className="pedidos-table">
              <thead>
                <tr>
                  <th>Legajo</th>
                  <th>Nombre</th>
                  <th>Comida</th>
                  <th>Cantidad</th> {/* Nueva columna */}
                  <th>Pedido Realizado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.legajo}</td>
                    <td>{pedido.User ? `${pedido.User.nombre} ${pedido.User.apellido}` : 'Desconocido'}</td>
                    <td>{pedido.menu}</td>
                    <td>{pedido.cantidad}</td> {/* Mostrar cantidad */}
                    <td>{pedido.realizado ? 'Sí' : 'No'}</td>
                    <td>
                      <button
                        className={pedido.realizado ? 'realizado' : ''}
                        onClick={() => handlePedidoRealizadoChange(pedido.id, pedido.realizado)}
                      >
                        {pedido.realizado ? 'Realizado' : 'No Realizado'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      )}

      <div className="buttons-container">
        <button onClick={handleClearPedidos}>Limpiar Pedidos del Día</button>
        <button onClick={() => navigate('/')}>Volver al Home</button>
      </div>
    </div>
  );
};

export default ConsultarPedidos;
