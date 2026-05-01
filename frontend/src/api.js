import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('mindease_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const sendMessage = (data) => API.post('/chat/message', data);
export const getChatHistory = () => API.get('/chat/history');
export const logMood = (data) => API.post('/mood/log', data);
export const getMoodHistory = () => API.get('/mood/history');
export const getMoodStats = () => API.get('/mood/stats');

export default API;
