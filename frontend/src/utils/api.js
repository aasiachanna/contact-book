import axios from 'axios';
import { storage } from './storage';

const API_BASE = 'http://localhost:5001/api';

function getValidToken() {
  const token = storage.getToken();
  if (!token || token === 'null' || token === 'undefined') return null;
  return token;
}

export const api = {
  get: async (url) => {
    const token = getValidToken();
    if (!token) throw new Error('No valid token');
    return axios.get(`${API_BASE}${url}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  post: async (url, data) => {
    const token = getValidToken();
    if (!token) throw new Error('No valid token');
    return axios.post(`${API_BASE}${url}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  put: async (url, data) => {
    const token = getValidToken();
    if (!token) throw new Error('No valid token');
    return axios.put(`${API_BASE}${url}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  delete: async (url) => {
    const token = getValidToken();
    if (!token) throw new Error('No valid token');
    return axios.delete(`${API_BASE}${url}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
