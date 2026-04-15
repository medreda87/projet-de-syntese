import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", 
  withCredentials : true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tokenFreshFold');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;