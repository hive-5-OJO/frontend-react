import axios from 'axios';

const API_URL_PY = import.meta.env.VITE_API_URL_PY || 'http://localhost:8000';

export const axiosInstancePy = axios.create({
  baseURL: API_URL_PY,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: accessToken을 헤더에 추가
axiosInstancePy.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 토큰 만료 시 처리
axiosInstancePy.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstancePy;
