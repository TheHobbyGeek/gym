import { ref, reactive } from 'vue';

const isAuthenticated = ref(false);
const user = reactive({
  id: null,
  username: '',
  email: '',
  fullName: '',
  phone: ''
});

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
};

export const useAuth = () => {
  const checkSetup = () => api('/auth/check');
  
  const setup = (setupData) => api('/auth/setup', {
    method: 'POST',
    body: JSON.stringify(setupData)
  });
  
  const login = (credentials) => api('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  
  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('authToken');
    isAuthenticated.value = false;
    Object.assign(user, { id: null, username: '', email: '', fullName: '', phone: '' });
  };
  
  const getProfile = () => api('/auth/profile');
  
  const updateProfile = (profileData) => api('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  
  const changePassword = (passwords) => api('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(passwords)
  });
  
  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const response = await getProfile();
      Object.assign(user, response.user);
      isAuthenticated.value = true;
      return true;
    } catch (error) {
      localStorage.removeItem('authToken');
      isAuthenticated.value = false;
      return false;
    }
  };
  
  const setAuth = (token, userData) => {
    localStorage.setItem('authToken', token);
    Object.assign(user, userData);
    isAuthenticated.value = true;
  };

  return {
    isAuthenticated,
    user,
    checkSetup,
    setup,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    checkAuth,
    setAuth
  };
};