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
    const count = computed(() => (servicos.value ? servicos.value.length : 0));

    function addItem(item: IServico) {
      // Para tornar a lista reativa, use a forma reativa do setter
      servicos.value = [...(servicos.value || []), item];

      Notify.create({
        type: 'positive',
        closeBtn: false,
        progress: true,
        caption: item.nome,
        message: 'Adicionado com sucesso :)',
      });
    }

    function deleteItem(item: IServico) {
      if (!item) return;
      if (!servicos.value) return;

      servicos.value.splice(servicos.value.indexOf(item), 1);

      Notify.create({
        type: 'negative',
        closeBtn: false,
        progress: true,
        caption: item.nome,
        message: 'Removido com sucesso :)',
      });
    }

    async function enviarSolicitacao(item: IServico) {
      const prefixo = date.formatDate(new Date(), 'MMYY');
      const _protocolo = geraNumDocumento(prefixo);

      await useApi<ISolicitacao>('/solicitacao')
        .post({
          prestador_id: item.prestador_id,
          servico_id: item.id,
          protocolo: _protocolo,
          valor: item.valor,
          vigencia_preco_dt: item.vigencia_dt,
          operador_id: 1, //todo: definir como sera solicitado o operador
          cidade_id: user?.cidade_id,
          categoria_id: item.categoria_id,
          especialidade_id: item.prestador.especialidade_id,
        })
        .then((data) => {
          console.log(data);
        });

      if (servicos.value) {
        servicos.value.splice(servicos.value.indexOf(item), 1);
      }
    }

    async function enviarItem(item: IServico) {
      if (!item) return;
      if (!servicos.value) return;

      await enviarSolicitacao(item);

      Notify.create({
        type: 'positive',
        closeBtn: false,
        progress: true,
        caption: item.nome,
        message: 'Enviado com sucesso :)',
      });
    }

    function enviarTodosItem() {
      if (!servicos.value) return;

      servicos.value.forEach(function (item) {
        enviarSolicitacao(item);
      });

      Notify.create({
        type: 'positive',
        closeBtn: false,
        progress: true,
        caption: 'Enviados com sucesso :)',
        message: '',
      });
    }

    return {
      servicos,
      count,
      addItem,
      deleteItem,
      enviarItem,
      enviarTodosItem,
    };
  },
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
  }
);
