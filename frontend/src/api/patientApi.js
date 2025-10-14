import api from './apiClient';
export const getPatients = () => api.get('/patients');
