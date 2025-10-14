import api from './apiClient';
export const getAppointments = () => api.get('/appointments');
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
