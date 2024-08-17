// src/axiosInterceptor.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Set your backend URL here
    withCredentials: true, // Ensure cookies are sent with requests
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = Cookies.get('refreshToken'); // Get refresh token from cookies
                if (refreshToken) {
                    const response = await api.post('/auth/refresh-token', {}, {
                        withCredentials: true, // Send cookies with the request
                    });
                    const newAccessToken = response.data.accessToken;
                    Cookies.set('token', newAccessToken); // Update access token in cookies
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                    return api(originalRequest);
                }
            } catch (error) {
                console.error('Token refresh error:', error);
                useNavigate()('/login'); // Use navigate to redirect
            }
        }
        return Promise.reject(error);
    }
);

