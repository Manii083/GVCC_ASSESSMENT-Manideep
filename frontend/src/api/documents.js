import apiClient from './client';

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getDocuments = async (search = '') => {
  const response = await apiClient.get(`/documents?search=${search}`);
  return response.data;
};

export const getDocument = async (id) => {
  const response = await apiClient.get(`/documents/${id}`);
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await apiClient.delete(`/documents/${id}`);
  return response.data;
};

export const getDocumentPreview = async (id) => {
  const response = await apiClient.get(`/documents/${id}/preview`);
  return response.data;
};