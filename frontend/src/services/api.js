import axios from 'axios';
const NODE_API = "http://localhost:5000/api";
const FAST_API = "http://localhost:8000";

export const authService = {
  login: (data) => axios.post(`${NODE_API}/auth/login`, data),
  signup: (data) => axios.post(`${NODE_API}/auth/signup`, data),
};

export const chatService = {
  sendMessage: (formData) => axios.post(`${NODE_API}/chat`, formData),
  getSessions: (userId) => axios.get(`${NODE_API}/chat/sessions/${userId}`),
  getSessionMessages: (sessionId) => axios.get(`${NODE_API}/chat/session/${sessionId}`),
  deleteSession: (sessionId) => axios.delete(`${NODE_API}/chat/session/${sessionId}`),
};