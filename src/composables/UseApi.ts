/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'src/boot/axios';
// import ServerError from 'src/exceptions/HandlerServer';
import { useAuthStore } from 'src/stores/auth-store';
import { uid } from 'quasar';

export default function useApi(endPoint: string) {
  function config() {
    api.defaults.headers.common = {
      Authorization: `Bearer ${useAuthStore().token}`,
    };
  }

  const post = async (body: any) => {
    try {
      config();

      const { data } = await api.post(endPoint, body);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const patch = async (id: number, body: any) => {
    try {
      config();

      const { data } = await api.patch(`${endPoint}/${id}`, body);

      return data;
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  };

  const get = async (query = '') => {
    try {
      config();

      const { data } = await api.get(`${endPoint}${query}`);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const show = async (id: any) => {
    try {
      config();

      const { data } = await api.get(`${endPoint}?id=${id}`);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  /*
  const uploadImg = async (file: any) => {
    try {
      config();

      //const formData = new FormData();
      //formData.append('content', file);
      console.log(file);
      const { data } = await api.post(endPoint, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  /*
  const getUrlPublic = async (fileName, storage) => {
    const { publicURL, error } = supabase
      .storage
      .from(storage)
      .getPublicUrl(fileName)
    if (error) throw error
    return publicURL
  }
  */

  return {
    post,
    show,
    get,
    patch,
    // uploadImg,
    // getUrlPublic,
  };
}
