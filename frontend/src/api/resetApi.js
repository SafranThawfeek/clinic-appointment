import api from './apiClient';

export const resetPassword = (payload) => api.post('/auth/reset-password', payload);
