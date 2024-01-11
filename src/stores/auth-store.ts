import { defineStore } from 'pinia';
import useApi from 'src/composables/UseApi';
import { LocalStorage } from 'quasar';
import { getLocation } from 'src/utils/geolocation';
import { tipo } from 'src/interfaces';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    darkMode: false,
    isLoggedIn: false,
    locale: 'pt-BR',
    limit: 10,

    user: {},
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

      const data = await useApi('/auth/login').post({
        email: email,
        password: password,
      });

      if (data) {
        this.token = data.authToken;

        await this.updateUser();

        return this.isLoggedIn;
      }
    },

    logout() {
      this.user = {};
      this.isLoggedIn = false;
      this.token = '';
    },

    async updateUser() {
      const me = await useApi('/auth/me').get('');
      if (me) {
        this.user = me;
        this.isLoggedIn = this.token !== '';

        /*TODO: TESTAR
        if (this.user.tipo == tipo.BENEFICIARIO) {
          await useApi('/user-location').put(this.user.id, {
            location: useAuthStore().coords,
          });
        }
        */
      }
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
