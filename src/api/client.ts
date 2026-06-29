import axios, { AxiosInstance, CancelTokenSource } from 'axios';
import { ApiError } from './types';

// We lazy-import the store to avoid circular deps
let getServerUrl: () => string = () => 'http://192.168.0.101:8000';

export const setServerUrlGetter = (fn: () => string) => {
  getServerUrl = fn;
};

const client: AxiosInstance = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject base URL dynamically from settings store on every request
client.interceptors.request.use(config => {
  config.baseURL = getServerUrl();
  return config;
});

// Normalize all errors to ApiError shape
client.interceptors.response.use(
  res => res,
  err => {
    const apiError: ApiError = {
      message:
        err.response?.data?.detail ??
        (err.code === 'ECONNABORTED' ? 'Request timed out. Is the server running?' : null) ??
        (err.message === 'Network Error' ? 'Cannot reach server. Check the URL in Settings.' : null) ??
        err.message ??
        'An unexpected error occurred.',
      status: err.response?.status,
    };
    return Promise.reject(apiError);
  }
);

export default client;

// ─── Cancel token factory ─────────────────────────────────────────────────────
export const createCancelToken = (): {
  token: CancelTokenSource['token'];
  cancel: CancelTokenSource['cancel'];
} => {
  const source = axios.CancelToken.source();
  return { token: source.token, cancel: source.cancel };
};

export const isCancel = axios.isCancel;
