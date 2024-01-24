import { defineStore } from 'pinia';
import useApi from 'src/composables/UseApi';
import { LocalStorage } from 'quasar';
import { getLocation } from 'src/utils/geolocation';
import { tipo, IUser, IToken } from 'src/interfaces';
import useNotify from 'src/composables/UseNotify';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    darkMode: false,
    isLoggedIn: false,
    locale: 'pt-BR',
    limit: 10,

    user: null as IUser | null,
    token: '',
    email: '',

    coords: {
      lat: '',
      lng: '',
    },
  }),

  getters: {
    getUser: (state) => state.user,
    getLoggedIn: (state) => state.isLoggedIn,

    isDark: (state) => {
      return state.darkMode;
    },
    i18Locale: (state) => {
      return state.locale;
    },

    getToken: (state) => {
      return state.token;
    },

    getEmail: (state) => {
      return state.email;
    },

    getCoords: (state) => {
      return state.coords;
    },
  },

  actions: {
    async login(email: string, password: string) {
      this.logout();

      this.email = email;

      const data = await useApi<IToken>('/auth/login').post({
        email: email,
        password: password,
      });

      if (data) {
        this.token = data.authToken;

        const me = await useApi<IUser>('/auth/me').get();
        this.updateUser(me);

        return this.isLoggedIn;
      }
    },

    logout() {
      this.user = null;
      this.isLoggedIn = false;
      this.token = '';
    },

    async updateUser(data: IUser) {
      this.user = data;
      this.isLoggedIn = this.token !== '';

      /*      const me = await useApi('/auth/me').get('');
      if (me) {
        this.user = me as IUser;
        this.isLoggedIn = this.token !== '';

      }


      await useApi<IUser>('/auth/me')
        .get()
        .then((data: IUser) => {
          console.log(data);
          this.user = data;
          this.isLoggedIn = this.token !== '';

          /*TODO: TESTAR
        if (this.user.tipo == tipo.BENEFICIARIO) {
          await useApi('/user-location').put(this.user.id, {
            location: useAuthStore().coords,
          });
        }

        });
        .catch((e) => {
          //useNotify().notifyError(e.message); //, JSON.stringify(e));
        });*/
    },

    setToken(authToken: string) {
      this.token = authToken;
    },

    getCurrentPosition() {
      getLocation(this.coords);
    },
  },

  persist: {
    key: 'medicalcareAppa268e10d02d64b538728f8b521640dd2',
    paths: [
      'token',
      'user',
      'darkMode',
      'locale',
      'isLoggedIn',
      'limit',
      'email',
      'coords',
    ],
    storage: {
      getItem(key: string) {
        return JSON.stringify(LocalStorage.getItem(key));
      },
      setItem(key: string, value: string) {
        LocalStorage.set(key, JSON.parse(value));
      },
    },
  },
});
