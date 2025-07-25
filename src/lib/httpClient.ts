import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { signIn, signOut } from "next-auth/react";

const httpClient: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
	const accessToken = localStorage.getItem("accessToken");

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

httpClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest: any = error.config;

		if (error.response?.status === 401) {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			await signOut();
			return Promise.reject(error);
		}

		// 🔄 Handle 403 Forbidden — try to refresh token
		if (error.response?.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({
						resolve: (token: string) => {
							originalRequest.headers.Authorization = `Bearer ${token}`;
							resolve(httpClient(originalRequest));
						},
						reject: (err: AxiosError) => {
							reject(err);
						},
					});
				});
			}

			isRefreshing = true;

			try {
				const refreshToken = localStorage.getItem("refreshToken");
				const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/refresh-token`, {
					refresh_token: refreshToken,
				});

				const newAccessToken = response.data.access_token;
				await signIn("credentials", {
					redirect: false,
					accessToken: newAccessToken,
					refreshToken,
					userData: JSON.stringify(response.data.user),
				});
				localStorage.setItem("accessToken", newAccessToken);

				processQueue(null, newAccessToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return httpClient(originalRequest);
			} catch (err: any) {
				processQueue(err, null);
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				await signOut();
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default httpClient;
