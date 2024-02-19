import { defineStore } from 'pinia';
import useApi from 'src/composables/UseApi';
import { LocalStorage, date } from 'quasar';
import { IServico, ISolicitacao } from 'src/interfaces';
import { Notify } from 'quasar';
import { ref, computed } from 'vue';
import { geraNumDocumento } from 'src/utils/stringUtils';
import { useAuthStore } from 'src/stores/auth-store';

export const useServicoStore = defineStore(
  'servicoStore',
  () => {
    const { user } = useAuthStore();
    const servicos = ref<IServico[] | null>([]);

    return {
      servicos,
    };
  } /*
  {
    persist: {
      key: 'medicalcareServico268e10d02d64b538728f8b521640dd2',
      paths: ['servicos'],
      storage: {
        getItem(key: string) {
          return JSON.stringify(LocalStorage.getItem(key));
        },
        setItem(key: string, value: string) {
          LocalStorage.set(key, JSON.parse(value));
        },
      },
    },
  }*/
);
