import axios from "axios";

const API = axios.create({
<<<<<<< HEAD
  baseURL: "http://127.0.0.1:8000/api/", 
  withCredentials : true,
=======
  baseURL: "http://127.0.0.1:8000/api", 
>>>>>>> 13d5055bc9b7c007ddd080e8d23da272db3a859b
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;