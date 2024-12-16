// src/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/', // Cambiar a la IP y puerto de tu servidor
});

export default api;
