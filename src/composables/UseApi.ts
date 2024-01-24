/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'src/boot/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from 'src/stores/auth-store';
import useNotify from 'src/composables/UseNotify';

interface ApiResponse<T = any> {
  data: T;
}

interface ApiError {
  response: {
    status: number;
  };
}

interface ApiConfig {
  headers?: Record<string, string>;
}

interface RequestOptions {
  query?: string;
  id?: number | string;
  body?: any;
}

interface ApiError {
  message: string;
  name: string;
  stack?: string;
  config: AxiosRequestConfig;
  code?: string;
  status: number;
}

export default function useApi<T>(endPoint: string) {
  const { notifyInfo, notifyError } = useNotify();

  function config() {
    api.defaults.headers.common = {
      Authorization: `Bearer ${useAuthStore().token}`,
    };

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          useAuthStore().logout();
          notifyInfo('Faça login novamente.');
        }
        return Promise.reject(error);
      }
    );
  }

  function handleApiError(error: AxiosError<ApiError>) {
    // Lógica para lidar com o erro da API
    if (error.response) {
      throw new Error(error.response.data.message);
    } else if (error.request) {
      console.error('Sem resposta da API:', error.request);
      throw new Error(error.request);
    } else {
      console.error('Erro durante a requisição:', error.message);
      throw new Error(error.message);
    }
  }

  const post = async (body: any) => {
    try {
      config();
      const { data }: ApiResponse<T> = await api.post(endPoint, body);
      return data;
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const put = async ({ id, body }: RequestOptions) => {
    try {
      config();
      const { data }: ApiResponse<T> = await api.put(`${endPoint}/${id}`, body);
      return data;
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const patch = async ({ id, body }: RequestOptions) => {
    try {
      config();

      const params = `${endPoint}/${id}`;

      const { data }: ApiResponse<T> = await api.patch(params, body);
      return data;
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const get = async ({ query }: RequestOptions = {}) => {
    try {
      config();

      let params: string;

      if (!query || query == undefined || query == '') {
        params = endPoint;
      } else {
        params = `${endPoint}/${query}`;
      }

      const { data }: ApiResponse<T> = await api.get(params);
      return data;
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const show = async ({ id }: RequestOptions) => {
    try {
      config();
      const { data }: ApiResponse<T> = await api.get(`${endPoint}?id=${id}`);
      return data;
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const remove = async ({ id }: RequestOptions) => {
    try {
      config();
      const { data }: ApiResponse<T> = await api.delete(`${endPoint}/${id}`);
      return data;
    } catch (error: any) {
      handleApiError(error);
    }
  };

  return {
    post,
    show,
    get,
    patch,
    put,
    remove,
  };
}
