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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const response = await axios.post(
                        'http://127.0.0.1:5000/api/token/refresh',
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`,
                            },
                        }
                    );

                    const newAccessToken = response.data.access_token;

                    localStorage.setItem('token', newAccessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string | null, refreshToken: string | null = null) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        console.log('Removing Authorization token');
        localStorage.removeItem('token');
    }

    if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
    } else {
        console.log('Removing refresh token');
        localStorage.removeItem('refresh_token');
    }
};

export const registerUser = async (username: string, email: string, password: string) => {
    return await api.post('/register', { username, email, password });
};

export const loginUser = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    const { access_token, refresh_token } = response.data;
    setAuthToken(access_token, refresh_token);
    return response;
};

export const logoutUser = () => {
    setAuthToken(null);
    window.location.href = '/login';
}

export default api;