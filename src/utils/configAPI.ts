import { api } from 'src/boot/axios';
import { useAppStore } from 'src/stores/app';
import useAuthUser from 'src/composables/UseAuthUser';
import { useRouter } from 'vue-router';

export function config() {
  const appStore = useAppStore();
  const { logout } = useAuthUser();
  const router = useRouter();

  api.interceptors.request.use(
    (config) => {
      config.headers['x-tenant'] = appStore.tenant;
      const token = appStore.token;
      if (token) {
        config.headers['x-access-token'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const rs = await refreshToken();
            const { newToken } = rs.data;
            appStore.token = newToken;
            api.defaults.headers.common['x-access-token'] = newToken;

            return api(originalConfig);
          } catch (_error) {
            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data);
            }

            return Promise.reject(_error);
          }
        }

        if (err.response.status === 403 && err.response.data) {
          return Promise.reject(err.response.data);
        }
      }

      return Promise.reject(err);
    }
  );

  const refreshToken = async () => {
    return await api
      .post('/user/refresh-token', {
        refreshToken: appStore.refreshToken,
      })
      .catch(async (error) => {
        // console.log(error);
        if (error.response.status === 401) {
          await logout();
          router.push('/login');
        }
      });
  };
}

/*
} catch (error) {
  if (error.response.status === 401) {
    // refresh token
  } else {
    if (error.response.status !== 200 || 204) {
       if (error.response.data.errorCode)
        throw new ServerError(
          i18n.global.t(error.response.data.errorCode),
          error
        );
      else throw new ServerError(error.message, error);
    }
  }
}
*/
