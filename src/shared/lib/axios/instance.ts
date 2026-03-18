import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface RefreshTokenResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
  message: string;
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: accessToken을 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 토큰 만료 시 자동 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');

        if (!refreshToken) {
          sessionStorage.removeItem('accessToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post<RefreshTokenResponse>(
          `${API_URL}/api/auth/refresh`,
          { refreshToken },
          { withCredentials: true },
        );

        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;

        sessionStorage.setItem('accessToken', newAccessToken);

        if (newRefreshToken) {
          sessionStorage.setItem('refreshToken', newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;