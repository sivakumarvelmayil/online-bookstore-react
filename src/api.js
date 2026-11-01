
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

// Request interceptor: Attach JWT token to outgoing requests.
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle API responses globally.
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    const url = error.config?.url || '';
                    const isAuthRequest =
                        url.includes('/api/auth/login') ||
                        url.includes('/api/auth/register');

                    if (!isAuthRequest) {
                        localStorage.removeItem('token');

                        window.dispatchEvent(
                            new CustomEvent('auth:unauthorized')
                        );
                    }
                    break;
                case 403:
                    console.error('Access denied.');
                    break;

                case 404:
                    console.error('Requested API resource not found.');
                    break;

                case 500:
                    console.error('Internal server error.');
                    break;

                default:
                    console.error(`API error: ${status}`);
            }
        } else if (error.request) {
            console.error('Unable to connect to the server.');
        } else {
            console.error('API request configuration error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
