import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const complaintsAPI = {
  getAll: () => API.get('/complaints'),
  create: (data) => API.post('/complaints', data),
  update: (id, data) => API.put(`/complaints/${id}`, data),
  delete: (id) => API.delete(`/complaints/${id}`),
  getStats: () => API.get('/complaints/stats'),
  getAnalytics: () => API.get('/complaints/analytics/report'),
  addRating: (id, data) => API.put(`/complaints/${id}/feedback`, data),
  uploadImage: (id, data) => API.post(`/complaints/${id}/images`, data),
  getTrending: () => API.get('/complaints/trending/issues'),
  getUsers: () => API.get('/users'),   // <-- corrected from 'api' to 'API'
};



export default API;