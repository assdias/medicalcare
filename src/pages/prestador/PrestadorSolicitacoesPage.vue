<template>
  <q-page-container>
    <q-page padding style="padding-top: 185px">
      <q-list>
        <q-item
          v-if="items && items.length === 0"
          class="tw-text-center tw-text-gray-400"
        >
          Nenhum registro.
        </q-item>
        <q-infinite-scroll @load="loadMoreItems" :offset="offset" v-else>
          <q-item
            v-for="(item, index) in items"
            :key="index"
            class="tw-border-t-2 tw-border-t-primary tw-shadow-md tw-my-4 tw-py-3 hover:tw-bg-gray-100"
          >
            <q-item-section> oi</q-item-section>
          </q-item>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-list>
      <q-page-sticky expand position="top">
        <q-card class="tw-w-full">
          <q-card-section :class="$q.screen.xs ? 'q-pa-sm' : 'q-pa-md'">
            <q-toolbar class="q-pa-none">
              <q-btn
                round
                flat
                icon="arrow_back"
                @click="$router.push('/prestador')"
              >
                <q-tooltip>Voltar</q-tooltip>
              </q-btn>
              <q-toolbar-title>Solicitações</q-toolbar-title>
              <q-space />
              <div
                v-for="(item, index) in optionsOperadores"
                :key="index"
                class="tw-space-x-3"
              >
                <q-btn flat @click="filtrarOperadora(item.id)">
                  <q-avatar size="62px">
                    <img :src="item.image.url" />
                  </q-avatar>
                  <div class="tw-ml-2">{{ item.name }}</div>
                </q-btn>
              </div>
            </q-toolbar>
          </q-card-section>
        </q-card>
      </q-page-sticky>
    </q-page>
  </q-page-container>
</template>
<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import {
  ISolicitacao,
  ICategoria,
  IResultAbstract,
  tipo,
} from 'src/interfaces';
import { useSolicitacaoStore } from 'src/stores/solicitacao-store';

interface IParams {
  operador_id: number;
  prestador_id: number;
  limit: number;
  offset: number;
  data_inicio: Date | null;
  data_fim: Date | null;
}

export interface IResult extends IResultAbstract {
  items: ISolicitacao[];
}

export default {
  name: 'PrestadorSolicitacoesPage',

  setup() {
    const $q = useQuasar();
    const loading = ref(false);
    const loadingOperadorSelect = ref(false);

    const { notifyError, notifySuccess } = useNotify();
    const { user, getAllUser } = useAuthStore();

    const solicitacaoStore = useSolicitacaoStore();
    const optionsOperadores = ref<IOperador[]>([]);

    const items = ref<ISolicitacao[] | null>([]);
    const params = ref<IParams>({
      operador_id: 0,
      prestador_id: 0,
      limit: 0,
      offset: 0,
      data_inicio: null,
      data_fim: null,
    });

    const offset = ref(0);
    const limit = 25; // Adjust the limit as needed
    const itemsTotal = ref(0);
    const itemsLoadTotal = ref(0);

    const loadMoreItems = async (index, done) => {
      if (!(params.value.operador_id > 0)) {
        if (done) done();
        return;
      }

      if (itemsTotal.value > 0 && itemsTotal.value === itemsLoadTotal.value) {
        if (done) done();
        return;
      }

      try {
        const result: IResult = (await fetchSolicitacao()) as IResult;

        itemsLoadTotal.value = result.items ? result.items.length : 0;
        itemsTotal.value = result.itemsTotal;

        if (result.items.length > 0) {
          items.value.push(...result.items);

          offset.value += limit;
        }
      } finally {
        if (done) done();
      }
    };

    const resetLoadMore = () => {
      offset.value = 0;
      itemsTotal.value = 0;
      itemsLoadTotal.value = 0;
    };

    const filtrarOperadora = (id: number) => {
      params.value.operador_id = id;
      resetLoadMore();

      loadMoreItems();
    };

    const fetchSolicitacao = async () => {
      if (!(params.value.operador_id > 0)) return;

      $q.loadingBar.start();

      const _params = {
        operador_id: params.value.operador_id,
        prestador_id: user.id,
        limit: limit,
        offset: offset.value,
      };

      return new Promise((resolve) => {
        useApi<IResult>('/solicitacao-searche')
          .post(_params)
          .then((data: IResult) => {
            resolve(data);
          })
          .catch((e) => {
            $q.loadingBar.stop();
            notifyError(e.message); //, JSON.stringify(e));
          })
          .finally(() => {
            $q.loadingBar.stop();
          });
      });
    };

    const fetchOperador = async () => {
      $q.loadingBar.start();
      loadingOperadorSelect.value = true;
      optionsOperadores.value = [];
      try {
        optionsOperadores.value = await getAllUser(tipo.OPERADOR);
      } catch (e) {
        notifyError(e.message);
      } finally {
        $q.loadingBar.stop();
        loadingOperadorSelect.value = false;
      }
    };

    onMounted(() => {
      resetLoadMore();
      fetchOperador();
    });

    return {
      tipo,
      user,
      loading,
      items,
      optionsOperadores,
      loadMoreItems,
      loadingOperadorSelect,
      filtrarOperadora,
    };
  },
};
</script>
