import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:5000');

const axiosInstance = axios.create({
    baseURL: `${apiUrl}/api/v1`,
    withCredentials: true
});

export default axiosInstance;