const API_BASE_URL = 'https://pos-backend-app-bmgcc4cud0edeufw.southeastasia-01.azurewebsites.net/api';
const AUTH_URL = 'https://pos-backend-app-bmgcc4cud0edeufw.southeastasia-01.azurewebsites.net/api/auth/login';

const autoLogin = async () => {
  try {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "username": "manager1",
        "password": "securePassword123"
      })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Auto-login failed:', error);
    throw error;
  }
};

export const apiService = {
  async request(endpoint, options = {}) {
    let token;
    try {
      if (!token) token = await autoLogin();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      };
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      
      if (response.status === 401) {
        const newToken = await autoLogin();
        headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
        return await retryResponse.json();
      }
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.request(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getCategories: () => apiService.request('/categories')
};