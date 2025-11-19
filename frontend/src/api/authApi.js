import api from './apiClient';

export const register = (payload) => api.post('/auth/register', payload);
export const login = (payload) => api.post('/auth/login', payload);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const me = () => api.get('/auth/me');
