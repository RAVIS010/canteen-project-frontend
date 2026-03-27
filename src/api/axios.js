import axios from 'axios';

// Get the backend URL from localStorage if it was set during login or use default
const baseURL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/'}`;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth tokens
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;

        // Dynamically update baseURL if it changed in localStorage
        config.baseURL = baseURL;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
let isRedirecting = false;

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred';

        console.error(`API Error [${status || 'No Status'}]:`, message);

        // Auto-redirect on 401 Unauthorized or specific token messages
        if (status === 401 || message.includes('Token expired') || message.includes('No token provided')) {
            if (!isRedirecting && window.location.pathname !== '/login') {
                isRedirecting = true;
                localStorage.removeItem('token');

                // Use window.location as we are outside React component hierarchy
                setTimeout(() => {
                    window.location.href = '/login';
                }, 100);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
