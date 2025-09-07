import axios from 'axios';

const API_BASE_URL = "https://apna-college-backend-nrz8.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;