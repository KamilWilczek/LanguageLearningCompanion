import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        console.log('Removing Authorization token');
        localStorage.removeItem('token');
    }
};

export const registerUser = async (username: string, email: string, password: string) => {
    return await api.post('/register', { username, email, password });
};

export const loginUser = async (email: string, password: string) => {
    return await api.post('/login', { email, password });
};

export const logoutUser = () => {
    setAuthToken(null);
}

export default api;