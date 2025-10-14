import api from './apiClient';
export const login = (data) => api.post('/auth/login', data);
