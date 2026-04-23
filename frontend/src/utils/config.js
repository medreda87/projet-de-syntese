// Central URL configuration — driven by REACT_APP_API_URL environment variable.
// Local:      set REACT_APP_API_URL=http://127.0.0.1:8000 in .env
// Production: set REACT_APP_API_URL=https://your-api.azurewebsites.net in .env.production

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const STORAGE_URL  = `${API_BASE_URL}/storage/`;
export const PRODUCTS_URL = `${API_BASE_URL}/images/products/`;

export default API_BASE_URL;
