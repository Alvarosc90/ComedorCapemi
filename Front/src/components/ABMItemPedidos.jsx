import React, { useState, useEffect } from 'react';
import api from '../../axiosConfig';  // Importar la configuración de axios
import { useNavigate } from 'react-router-dom';
import '../css/ABMItemPedidos.css';

export default function ABMItemPedidos() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
  });
  const [editItem, setEditItem] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/menus');  // Usar api en lugar de axios directamente
        setItems(response.data);
      } catch (error) {
        console.error('Error al obtener los items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editItem) {
      setEditItem((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/menus', newItem);  // Usar api para hacer el post
      setItems((prevItems) => [...prevItems, response.data]);
      setNewItem({ nombre: '', descripcion: '', precio: 0 });
    } catch (error) {
      console.error('Error al crear el item:', error);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/menus/${editItem.id}`, editItem);  // Usar api para hacer el put
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === editItem.id ? response.data : item))
      );
      setEditItem(null);
    } catch (error) {
      console.error('Error al editar el item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/menus/${id}`);  // Usar api para hacer el delete
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar el item:', error);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="abm-pedidos-container">
      <h2 className='abm-item-pedidos__h2'>ABM Productos</h2>
      {/* Formulario para agregar o editar */}
      <form
        className="abm-item-pedidos__form"
        onSubmit={editItem ? handleEditItem : handleCreateItem}
      >
        <div >
        <label className="abm-item-pedidos__label">Nombre:</label>
          <input
            className="abm-item-pedidos__input"
            type="text"
            name="nombre"
            value={editItem ? editItem.nombre : newItem.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label  className="abm-item-pedidos__label">Descripción:</label>
          <input
            className="abm-item-pedidos__input"
            type="text"
            name="descripcion"
            value={editItem ? editItem.descripcion : newItem.descripcion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label  className="abm-item-pedidos__label">Precio:</label>
          <input
            className="abm-item-pedidos__input"
            type="number"
            name="precio"
            value={editItem ? editItem.precio : newItem.precio}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="abm-item-pedidos__button" type="submit">
          {editItem ? 'Guardar Cambios' : 'Crear Producto'}
        </button>
      </form>
  
      {/* Mostrar los items existentes */}
      <h3>Lista de Items</h3>
      <div className="abm-item-pedidos__list">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="abm-item-pedidos__list-item" key={item.id}>
              <p>
                {item.nombre} - {item.descripcion} - Precio: {item.precio}
              </p>
              <button
                className="abm-item-pedidos__list-button"
                onClick={() => setEditItem(item)}
              >
                Editar
              </button>
              <button
                className="abm-item-pedidos__list-button abm-item-pedidos__delete-button"
                onClick={() => handleDeleteItem(item.id)}
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No hay items disponibles</p>
        )}
      </div>
  
      {/* Botón para volver al Home */}
      <button className="abm-item-pedidos__home-button" onClick={handleGoHome}>
        Volver al Home
      </button>
    </div>
  );
  
}
