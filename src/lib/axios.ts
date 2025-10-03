import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

import {
  setSession,
  JWT_STORAGE_KEY,
  USER_LOCAL_STORAGE,
  JWT_REFRESH_STORAGE_KEY,
} from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Đã xảy ra lỗi')
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem(JWT_REFRESH_STORAGE_KEY);
      try {
        const { data } = await axiosInstance.post(endpoints.auth.refresh, {
          refreshToken,
        });
        setSession(data.data.accessToken, data.data.refreshToken);
        axios.defaults.headers.common.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem(JWT_REFRESH_STORAGE_KEY);
        sessionStorage.removeItem(JWT_STORAGE_KEY);
        localStorage.removeItem(USER_LOCAL_STORAGE);
        delete axiosInstance.defaults.headers.common.Authorization;
        window.location.href = '/';
        console.error('Error during token expiration:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    // me: '/api/auth/me',
    signIn: '/api/v1/guest/login',
    signUp: '/api/auth/sign-up',
    refresh: '/api/v1/user/refresh-token',
  },
  user: {
    list: '/api/v1/admin/get-users',
    changeStatus: '/api/v1/admin/change-user-status',
    changePassword: '/api/v1/admin/change-user-password',
    roles: '/api/v1/admin/get-roles',
    createUser: '/api/v1/admin/create-user',
    changeInfomation: '/api/v1/user/change-information',
    changePasswordMe: '/api/v1/user/change-password',
  },
  examTemplate: {
    list: '/api/v1/exam-template/list',
    edit: '/api/v1/exam-template/edit',
    create: 'api/v1/exam-template/create-exam-template',
    prompt: '/api/v1/exam-template/create-exam-template-by-prompt',
  },
  examSession: {
    list: 'api/v1/exam-session/list',
    create: 'api/v1/exam-session/create-exam-session',
    openOrClose: '/api/v1/exam-session/open-or-close-exam-session',
    mark: '/api/v1/exam-session/mark-exam',
    scores: '/api/v1/exam-session/scores',
  },
  exam: {
    pin: 'api/v1/guest/enroll-exam-session',
    submit: 'api/v1/guest/submit-exam',
  },
};
