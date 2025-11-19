import api from './apiClient';
import axios from 'axios';
import { getApiBase } from '../utils/env';

const baseURL = `${getApiBase()}/api`;

export const getPatients = () => api.get('/patients');

export const createPatient = async (data) => {
  // Check if data is FormData (has image)
  if (data instanceof FormData) {
    // Create a fresh axios instance for FormData to avoid header conflicts
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type - let browser set it with boundary
    return axios.post(`${baseURL}/patients`, data, { headers });
  }
  return api.post('/patients', data);
};

export const updatePatient = async (id, data) => {
  // Check if data is FormData (has image)
  if (data instanceof FormData) {
    // Create a fresh axios instance for FormData to avoid header conflicts
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type - let browser set it with boundary
    return axios.put(`${baseURL}/patients/${id}`, data, { headers });
  }
  return api.put(`/patients/${id}`, data);
};

export const deletePatient = async (id) => {
  return api.delete(`/patients/${id}`);
};
