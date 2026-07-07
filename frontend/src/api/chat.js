import apiClient from './client';

export const askQuestion = async (data) => {
  const response = await apiClient.post('/chat/ask', data);
  return response.data;
};

export const getHistory = async (page = 1, limit = 10, search = '') => {
  const response = await apiClient.get(`/chat/history?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const getConversation = async (id) => {
  const response = await apiClient.get(`/chat/history/${id}`);
  return response.data;
};