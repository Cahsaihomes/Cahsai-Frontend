import axios, { InternalAxiosRequestConfig } from "axios";
import { store } from "../redux";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000/api";

export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
});

export const privateAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const multipartPrivateAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const multipartPublicAxios = axios.create({
  baseURL: API_BASE_URL,
});

export const publicAxiosWithToken = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// -------------------- //
// Interceptor Helper
// -------------------- //
const attachToken = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
};

publicAxiosWithToken.interceptors.request.use(attachToken);
multipartPrivateAxios.interceptors.request.use(attachToken);
privateAxios.interceptors.request.use(attachToken);
