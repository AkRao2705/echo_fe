import axios from 'axios';
import { useEffect } from 'react';
import { useAuthToken } from './useAuthToken';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URI,
  timeout: 180000,
});

const useAxiosInterceptor = (token: string | null) => {
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized errors
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [token]); // Dependency array includes getToken
};

const useAxios = () => {
  const token = useAuthToken();
  useAxiosInterceptor(token);

  return axiosInstance;
};

export default useAxios;

