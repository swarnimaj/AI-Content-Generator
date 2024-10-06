// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const signup = async (username, email, password) => {
  const response = await api.post('/auth/signup', { username, email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const generateContent = async (topic) => {
  const response = await api.post('/content/generate', { topic });
  return response.data.content;
};

export const saveContent = async (content, type) => {
  try {
    console.log('Saving content to:', `${API_URL}/content/save`);
    console.log('Content:', content);
    console.log('Type:', type);
    const response = await api.post('/content/save', { content, type });
    console.log('Save response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in saveContent:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getSavedContents = async () => {
  const response = await api.get('/content');
  return response.data;
};

export const updateContent = async (id, content) => {
  const response = await api.put(`/content/${id}`, { content });
  return response.data;
};

export const deleteContent = async (id) => {
  const response = await api.delete(`/content/${id}`);
  return response.data;
};

export default api;