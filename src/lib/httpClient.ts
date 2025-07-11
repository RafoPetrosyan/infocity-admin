// import { setAccessToken } from '@/store/slices/auth';
import { AppStore } from '@/store/store';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { signOut } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const httpClient = axios.create({ baseURL });

let store: AppStore | null = null;
export const setHttpClientStore = (appStore: AppStore) => {
  store = appStore;
};

httpClient.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response && error.response.status === 401) {
      await signOut();
      localStorage.removeItem('accessToken');
    }

    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // @ts-ignore
        return (
          new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            // @ts-ignore
            .then((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return httpClient(originalRequest);
            })
            .catch((err) => Promise.reject(err))
        );
      }

      isRefreshing = true;
      try {
        // @ts-ignore
        const refreshToken = error.response?.data.refreshToken;
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const oldAccessToken = localStorage.getItem('accessToken');

        const { data } = await axios.post(
          `${baseURL}/auth/access-token`,
          { token: refreshToken },
          { headers: { Authorization: `Bearer ${oldAccessToken}` } }
        );

        const newAccessToken = data.data.accessToken;
        // store?.dispatch(setAccessToken(newAccessToken));
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // @ts-ignore
        if (err?.request?.status === 401) {
          await signOut();
          localStorage.removeItem('accessToken');
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
