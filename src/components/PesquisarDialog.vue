<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide" maximized>
    <q-card class="q-dialog-plugin">
      <q-layout view="lHh Lpr lFf" container style="min-height: 100vh">
        <q-header elevated>
          <q-toolbar>
            <q-btn round flat icon="arrow_back" v-close-popup>
              <q-tooltip>Voltar</q-tooltip>
            </q-btn>
            <q-toolbar-title>Pesquise nossos serviços</q-toolbar-title>
            <q-space />
            <q-btn dense color="warning" round icon="mail" class="q-ml-md">
              <q-badge color="red" floating>4</q-badge>
            </q-btn>
          </q-toolbar>
          <q-card flat>
            <q-card-section v-if="showFiltro">
              <q-select
                v-bind="{ ...$themeSelect }"
                v-model="params.cidade_id"
                :loading="loadingCidadeSelect"
                label="Localidade"
                :options="optionsCidades"
                option-value="id"
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'nome' in opt
                      ? selectCidadeLabel(opt)
                      : null
                "
                emit-value
                map-options
                @filter="cidadeFilterFn"
                @filter-abort="cidadeAbortFilterFn"
                hint="Selecione uma localidade onde temos cobertura."
                lazy-rules
                :rules="[
                  (val) => (!isNaN(val) && !!val) || 'Selecione uma cidade',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>

                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      -) Cidade não encontrada
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>
            <q-card-section v-if="showFiltro">
              <q-select
                v-bind="{ ...$themeSelect }"
                v-model="params.categoria_id"
                :loading="loadingCategoriaSelect"
                label="Categoria"
                :options="optionsCategorias"
                option-value="id"
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'nome' in opt
                      ? selectCategoriaLabel(opt)
                      : null
                "
                emit-value
                map-options
                clearable
                @filter="categoriaFilterFn"
                @filter-abort="categoriaAbortFilterFn"
                hint="Selecione uma categoria."
                lazy-rules
                :rules="[
                  (val) => (!isNaN(val) && !!val) || 'Selecione uma categoria',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="category" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      -) Categoria não encontrada
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>
            <q-card-section
              v-if="!showFiltro"
              class="row tw-space-x-3 tw-items-center tw-text-gray-500"
            >
              <q-breadcrumbs-el :label="breadcrumbCidade" icon="place" />
              <q-breadcrumbs-el :label="breadcrumbCategoria" icon="category" />
            </q-card-section>
            <q-card-section>
              <q-input
                v-bind="{ ...$themeInputUppercase }"
                label="Digite o que procura :)"
                :hint="msg.PESQUISA"
                lazy-rules
                :rules="[(val) => (val && val.length > 3) || msg.PESQUISA]"
                v-model="params.text"
                :clearable="false"
                maxlength="100"
                counter
                debounce="1000"
                :loading="loadingTextInput"
                :disable="disableText"
                @input="handleInput"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:append>
                  <q-icon
                    v-if="params.text"
                    name="cancel"
                    @click.stop.prevent="params.text = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </q-header>
        <q-page-container>
          <q-page padding>
            <q-list>
              <q-infinite-scroll @load="loadMoreItems" :offset="offset">
                <q-item
                  v-for="(item, index) in items"
                  :key="index"
                  class="tw-border-t-2 tw-border-t-primary tw-shadow-md tw-my-4 tw-py-3 hover:tw-bg-gray-100"
                >
                  <q-item-section>
                    <q-item-label lines="2">
                      <span class="text-weight-medium">{{ item.nome }}</span>
                    </q-item-label>
                    <q-item-label caption class="row tw-justify-between"
                      ><div>{{ item.categoria.nome }}</div>
                      <div>#{{ item.referencia }}</div>
                    </q-item-label>
                    <q-item-label lines="1" caption>
                      <div>{{ item.prestador.name }}</div>
                    </q-item-label>
                    <q-separator class="tw-my-3" />
                    <q-item-section>
                      <div class="row tw-justify-end tw-space-x-5">
                        <q-chip
                          size="lg"
                          outline
                          color="negative"
                          text-color="white"
                          :label="formatCurrency(item.valor)"
                        />
                        <q-space />
                        <q-btn
                          round
                          dense
                          color="info"
                          icon="map"
                          class="tw-w-9 tw-h-9"
                        />
                        <q-btn
                          round
                          dense
                          color="teal-6"
                          icon="mdi-whatsapp"
                          class="tw-w-9 tw-h-9"
                        />
                        <q-btn
                          round
                          dense
                          color="warning"
                          icon="send"
                          class="tw-w-9 tw-h-9"
                        >
                          <q-tooltip class="bg-warning"
                            >Enviar solicitação</q-tooltip
                          >
                        </q-btn>
                      </div>
                    </q-item-section>
                  </q-item-section>
                </q-item>

                <template v-slot:loading>
                  <div class="row justify-center q-my-md">
                    <q-spinner-dots color="primary" size="40px" />
                  </div>
                </template>
              </q-infinite-scroll>
            </q-list>
            <!-- place QPageScroller at end of page -->
            <q-page-scroller
              position="bottom-right"
              :scroll-offset="150"
              :offset="[18, 18]"
            >
              <q-btn fab icon="keyboard_arrow_up" color="accent" />
            </q-page-scroller>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref, computed, watch } from 'vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { useQuasar } from 'quasar';
import { msg } from 'src/interfaces';
//import {formatDate,formatDateBR,} from 'src/utils/dateUtils';
import { formatCurrency } from 'src/utils/numberUtils';
import { useAuthStore } from 'src/stores/auth-store';

interface IParams {
  cidade_id: number;
  categoria_id: number | null;
  text: string;
}

export interface IResult {
  itemsReceived: number;
  curPage: number;
  nextPage: number;
  prevPage: null;
  offset: number;
  itemsTotal: number;
  pageTotal: number;
  items: IItems[];
}

export interface IItems {
  id: number;
  created_at: number;
  categoria_id: number;
  prestador_id: number;
  referencia: string;
  nome: string;
  observacao: string;
  valor: number;
  vigencia_dt: number;
  prestador: IPrestador;
  categoria: ICategoria;
}

export interface IPrestador {
  name: string;
  email: string;
  cidade_id: number;
  cpf_cnpj: string;
  whatsapp: string;
  fone: string;
  classificacao_id: number;
  especialidade_id: IEspecialidadeId[][];
  location: ILocation;
  image: IImage;
  cidade: ICidade;
  classificacao: IClassificacao;
}

export interface IEspecialidadeId {
  nome: string;
}

export interface ILocation {
  type: string;
  data: IData;
}

export interface IData {
  lng: number;
  lat: number;
}

export interface IImage {
  url: string;
}

export interface ICidade {
  id: number;
  nome: string;
  uf: string;
}

export interface IClassificacao {
  id: number;
  nome: string;
}

export interface ICategoria {
  id: number | null;
  nome: string;
}

export default {
  name: 'CidadadeDialog',

  props: {
    list: {
      type: Array,
    },
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup(props) {
    const $q = useQuasar();
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, /*onDialogOK,*/ onDialogCancel } =
      useDialogPluginComponent();
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    const formCadRef = ref(null);
    const loading = ref(false);
    const loadingTextInput = ref(false);
    const loadingCidadeSelect = ref(false);
    const loadingCategoriaSelect = ref(false);

    const { notifyError /*, notifySuccess*/ } = useNotify();

    const optionsCidades = ref<ICidade[]>([]);
    const optionsServerCidades = ref<ICidade[]>([]);

    const optionsCategorias = ref<ICategoria[]>([]);
    const optionsServerCategorias = ref<ICategoria[]>([]);

    const result = ref<IResult | null>(null);
    const items = ref<IItems[] | null>([]);
    const params = ref<IParams>({
      cidade_id: useAuthStore().user.cidade_id,
      categoria_id: null,
      text: '',
    });

    const breadcrumbCidade = ref('');
    const breadcrumbCategoria = ref('');

    const offset = ref(0);
    const limit = 25; // Adjust the limit as needed
    const itemsTotal = ref(0);
    const isLoadingMore = ref(false);

    const fetchCidade = async () => {
      $q.loadingBar.start();
      loadingCidadeSelect.value = true;
      optionsServerCidades.value = [];
      await useApi('/cidade')
        .get()
        .then((data: ICidade[]) => {
          optionsServerCidades.value = data;
          optionsCidades.value = data;
        })
        .catch((e) => {
          notifyError(e.message); //, JSON.stringify(e));
        })
        .finally(() => {
          $q.loadingBar.stop();
          loadingCidadeSelect.value = false;
        });
    };

    fetchCidade();

    const fetchCategoria = async () => {
      $q.loadingBar.start();
      loadingCategoriaSelect.value = true;
      optionsServerCategorias.value = [];
      await useApi('/categoria')
        .get()
        .then((data: ICategoria[]) => {
          optionsServerCategorias.value = data;
          optionsCategorias.value = data;
        })
        .catch((e) => {
          notifyError(e.message); //, JSON.stringify(e));
        })
        .finally(() => {
          $q.loadingBar.stop();
          loadingCategoriaSelect.value = false;
        });
    };

    fetchCategoria();

    const selectCidadeLabel = (opt: ICidade) => {
      breadcrumbCidade.value = `${opt.nome} - ${opt.uf}`;
      return breadcrumbCidade.value;
    };

    const selectCategoriaLabel = (opt: ICategoria) => {
      breadcrumbCategoria.value = opt.nome;
      return breadcrumbCategoria.value;
    };

    const showFiltro = computed(() => {
      return params.value.text.length <= 3;
    });

    const disableText = computed(() => {
      return (
        !params.value.categoria_id ||
        params.value.categoria_id == 0 ||
        params.value.cidade_id == 0
      );
    });

    const loadMoreItems = async (index, done) => {
      try {
        if (itemsTotal.value > 0 && itemsTotal.value === items.value?.length)
          return;

        const result: IResult = (await fetchServico()) as IResult;

        itemsTotal.value = result.itemsTotal;

        if (result.items.length > 0) {
          items.value.push(...result.items);

          offset.value += limit;
        }
      } finally {
        if (done) done();
      }
    };

    const fetchServico = async () => {
      $q.loadingBar.start();

      result.value = null;
      const _text = `%${params.value.text
        .trim()
        .toLocaleUpperCase()
        .replace(' ', '%')}%`;

      const _params = {
        text: _text,
        cidade_id: params.value.cidade_id,
        categoria_id: params.value.categoria_id,
        limit: limit,
        offset: offset.value,
      };

      return new Promise((resolve) => {
        useApi('/servico-searche')
          .post(_params)
          .then((data: IResult) => {
            resolve(data);
          })
          .catch((e) => {
            notifyError(e.message); //, JSON.stringify(e));
          })
          .finally(() => {
            $q.loadingBar.stop();
          });
      });
    };

    const handleInput = async () => {
      //  if (itemsTotal.value > 0 && params.value.text.length === 0) {
      offset.value = 0;
      itemsTotal.value = 0;
      items.value = [];
      //    return;
      //  }

      if (params.value.text.length > 3) {
        try {
          loadingTextInput.value = true;
          await loadMoreItems(0, null);
        } finally {
          loadingTextInput.value = false;
        }
      }
    };

    watch(params.value, handleInput);

    return {
      loadMoreItems,
      offset,
      isLoadingMore,
      handleInput,
      showFiltro,
      disableText,
      selectCidadeLabel,
      breadcrumbCidade,
      selectCategoriaLabel,
      breadcrumbCategoria,
      params,
      items,
      itemsTotal,
      loading,
      loadingTextInput,
      loadingCidadeSelect,
      loadingCategoriaSelect,
      optionsCidades,
      optionsCategorias,
      props,
      msg,
      formCadRef,
      formatCurrency,

      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      clearText() {
        params.value.text = '';
      },

      cidadeFilterFn(val, update, abort) {
        if (val === '') {
          update(() => {
            optionsCidades.value = optionsServerCidades.value;

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
          });
          return;
        }

        update(() => {
          const needle = val.toUpperCase();
          optionsCidades.value = optionsServerCidades.value.filter(
            (v) => v.nome.toUpperCase().indexOf(needle) > -1
          );
        });

        abort(() => {
          loadingCidadeSelect.value = false;
        });
      },

      cidadeAbortFilterFn() {
        loadingCidadeSelect.value = false;
      },

      categoriaFilterFn(val, update, abort) {
        if (val === '') {
          update(() => {
            optionsCategorias.value = optionsServerCategorias.value;

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
          });
          return;
        }

        update(() => {
          const needle = val.toUpperCase();
          optionsCategorias.value = optionsServerCategorias.value.filter(
            (v) => v.nome.toUpperCase().indexOf(needle) > -1
          );
        });

        abort(() => {
          loadingCategoriaSelect.value = false;
        });
      },

      categoriaAbortFilterFn() {
        // console.log('delayed filter aborted')
        loadingCategoriaSelect.value = false;
      },
    };
  },
};
</script>
