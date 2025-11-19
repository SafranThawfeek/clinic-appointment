import apiClient from "./apiClient";

export const createDoctor = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return apiClient.post("/doctors", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateDoctor = async (id, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return apiClient.put(`/doctors/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getDoctors = async (search = "") =>
  apiClient.get(`/doctors?search=${search}`);

export const deleteDoctor = async (id) => apiClient.delete(`/doctors/${id}`);
