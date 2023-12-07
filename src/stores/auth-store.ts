import { defineStore } from 'pinia';
import useApi from 'src/composables/UseApi';
import { LocalStorage } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    darkMode: false,
    isLoggedIn: false,
    locale: 'pt-BR',
    limit: 10,

    user: {},
    token: '',
    email: '',
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
  },

  actions: {
    async login(email: string, password: string) {
      this.email = email;

      const data = await useApi('/auth/login').post({
        email: email,
        password: password,
      });

      if (data) {
        this.token = data.authToken;

        await this.updateUser();

        this.isLoggedIn = this.token !== '';
        return this.token !== '';
      }
    },

    logout() {
      this.user = {};
      this.isLoggedIn = false;
    },

    async updateUser() {
      const me = await useApi('/auth/me').get('');
      if (me) {
        this.user = me;
      }
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
