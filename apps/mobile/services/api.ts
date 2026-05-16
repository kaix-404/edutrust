import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.29.216:5000',
});

export default api;