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
                <div class="flex flex-nowrap tw-space-x-5 tw-items-center">
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
                    color="positive"
                    icon="mdi-information-variant"
                    class="tw-w-9 tw-h-9"
                    v-if="item.prestador.fone || item.prestador.whatsapp"
                  >
                    <q-popup-proxy class="tw-w-56">
                      <q-card dense>
                        <q-bar>
                          <div>Contato</div>

                          <q-space />

                          <q-btn round dense flat icon="close" v-close-popup>
                            <q-tooltip>Fechar</q-tooltip>
                          </q-btn>
                        </q-bar>

                        <q-card-section>
                          <q-list separator>
                            <q-item
                              clickable
                              v-ripple
                              v-if="item.prestador.fone"
                              :href="`tel:${item.prestador.fone}`"
                              target="_blank"
                            >
                              <q-item-section avatar>
                                <q-icon
                                  color="primary"
                                  name="phone"
                                  class="tw-p-0"
                                />
                              </q-item-section>

                              <q-item-section no-wrap>
                                <q-item-label>
                                  {{ formatCel(item.prestador.fone) }}
                                </q-item-label>
                                <q-item-label caption>Fone / Cel.</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              clickable
                              v-ripple
                              v-if="item.prestador.whatsapp"
                              :href="
                                sendTextWhatsapp(
                                  item.prestador.whatsapp,
                                  item.nome
                                )
                              "
                              target="_blank"
                            >
                              <q-item-section avatar>
                                <q-icon color="primary" name="mdi-whatsapp" />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label>{{
                                  item.prestador.whatsapp
                                }}</q-item-label>
                                <q-item-label caption>Whatsapp</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-card-section>
                      </q-card>
                    </q-popup-proxy>
                  </q-btn>
                  <q-btn
                    round
                    dense
                    color="positive"
                    icon="mdi-google-maps"
                    class="tw-w-9 tw-h-9"
                    @click="onShowLocalizacao(item)"
                  />
                  <q-btn
                    round
                    dense
                    color="warning"
                    icon="playlist_add"
                    class="tw-w-9 tw-h-9"
                    size="18px"
                    @click="onAddSolicitacao(item)"
                  >
                    <q-tooltip class="bg-warning">Adicionar na lista</q-tooltip>
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

      <q-page-sticky expand position="top">
        <q-card class="tw-w-full">
          <q-card-section :class="$q.screen.xs ? 'q-pa-sm' : 'q-pa-md'">
            <q-toolbar class="q-pa-none">
              <q-btn
                round
                flat
                icon="arrow_back"
                @click="$router.push('/beneficiario')"
              >
                <q-tooltip>Voltar</q-tooltip>
              </q-btn>
              <q-toolbar-title>Pesquisar serviços</q-toolbar-title>
              <q-space />
              <q-btn
                dense
                color="warning"
                round
                icon="checklist"
                class="q-ml-md"
                :disable="solicitacaoStore.count == 0"
              >
                <q-badge color="red" rounded floating>{{
                  solicitacaoStore.count
                }}</q-badge>

                <q-menu auto-close style="width: 300px">
                  <q-card>
                    <q-card-section class="q-pa-sm">
                      <q-virtual-scroll
                        class="tw-space-y-1"
                        style="max-height: 300px"
                        :items="solicitacaoStore.servicos"
                        v-slot="{ item, index }"
                      >
                        <q-item
                          :key="index"
                          class="tw-border-t-2 tw-border-t-primary hover:tw-bg-gray-100"
                        >
                          <q-item-section>
                            <q-item-label lines="1">
                              <span class="text-weight-medium">{{
                                item.nome
                              }}</span>
                            </q-item-label>
                            <q-item-label caption class="row tw-justify-between"
                              ><div>{{ item.prestador.name }}</div>
                              <div>#{{ item.referencia }}</div>
                            </q-item-label>
                            <q-separator class="tw-my-3" />
                            <q-item-section>
                              <div
                                class="flex flex-nowrap tw-space-x-4 tw-items-center"
                              >
                                <q-chip
                                  size="md"
                                  outline
                                  color="negative"
                                  text-color="white"
                                  :label="formatCurrency(item.valor)"
                                />
                                <q-space />
                                <q-btn
                                  round
                                  dense
                                  color="negative"
                                  icon="delete"
                                  class="tw-w-9 tw-h-9"
                                  @click="onDelete(item)"
                                >
                                </q-btn>
                                <q-btn
                                  round
                                  dense
                                  color="warning"
                                  icon="send"
                                  class="tw-w-9 tw-h-9"
                                  @click="onEnviar(item)"
                                />
                              </div>
                            </q-item-section>
                          </q-item-section>
                        </q-item>
                      </q-virtual-scroll>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="center" class="q-pa-md">
                      <q-btn
                        color="warning"
                        icon="send"
                        label="Enviar Todos"
                        @click="onEnviarTodos()"
                      />
                    </q-card-actions>
                  </q-card>
                </q-menu>
              </q-btn>
            </q-toolbar>
          </q-card-section>
          <q-separator />
          <q-card-section
            v-if="showFiltro"
            :class="$q.screen.xs ? 'q-pa-sm' : 'q-pa-md'"
          >
            <q-select
              v-bind="{ ...$themeSelect }"
              v-model="params.cidade_id"
              :loading="loadingCidadeSelect"
              label="Localidade"
              :dense="$q.screen.xs"
              options-dense
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
          <q-card-section
            v-if="showFiltro"
            :class="$q.screen.xs ? 'q-pa-sm' : 'q-pa-md'"
          >
            <q-select
              v-bind="{ ...$themeSelect }"
              v-model="params.categoria_id"
              :loading="loadingCategoriaSelect"
              label="Categoria"
              :dense="$q.screen.xs"
              options-dense
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
            class="row tw-space-x-3 tw-items-center tw-text-gray-500 tw-pb-0"
          >
            <q-breadcrumbs-el :label="breadcrumbCidade" icon="place" />
            <q-breadcrumbs-el :label="breadcrumbCategoria" icon="category" />
          </q-card-section>
          <q-card-section :class="$q.screen.xs ? 'q-pa-sm' : 'q-pa-md'">
            <q-input
              v-bind="{ ...$themeInputUppercase }"
              label="Digite o que procura :)"
              :dense="$q.screen.xs"
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
      </q-page-sticky>
    </q-page>
  </q-page-container>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { useQuasar } from 'quasar';
import { msg } from 'src/interfaces';
import { formatCel, formatCPF } from 'src/utils/stringUtils';
//import {formatDate,formatDateBR,} from 'src/utils/dateUtils';
import { formatCurrency, extractNumber } from 'src/utils/numberUtils';
import { useAuthStore } from 'src/stores/auth-store';
import LocalizacaoPrestadorDialog from 'src/components/LocalizacaoPrestadorDialog.vue';
import { IServico, ICategoria, ICidade, IResultAbstract } from 'src/interfaces';
import { useSolicitacaoStore } from 'src/stores/solicitacao-store';
//import { storeToRefs } from 'pinia';

interface IParams {
  cidade_id: number;
  categoria_id: number | null;
  text: string;
}

export interface IResult extends IResultAbstract {
  items: IServico[];
}

export default {
  name: 'PesquisaServicoPage',

  setup() {
    const $q = useQuasar();
    const loading = ref(false);
    const loadingTextInput = ref(false);
    const loadingCidadeSelect = ref(false);
    const loadingCategoriaSelect = ref(false);

    const { notifyError, notifySuccess } = useNotify();
    const { user } = useAuthStore();

    const solicitacaoStore = useSolicitacaoStore();

    const optionsCidades = ref<ICidade[]>([]);
    const optionsServerCidades = ref<ICidade[]>([]);

    const optionsCategorias = ref<ICategoria[]>([]);
    const optionsServerCategorias = ref<ICategoria[]>([]);

    //const result = ref<IResult | null>(null);
    const items = ref<IServico[] | null>([]);
    const params = ref<IParams>({
      cidade_id: user.cidade_id,
      categoria_id: null,
      text: '',
    });

    const breadcrumbCidade = ref('');
    const breadcrumbCategoria = ref('');

    const offset = ref(0);
    const limit = 25; // Adjust the limit as needed
    const itemsTotal = ref(0);
    const itemsLoadTotal = ref(0);

    const fetchCidade = async () => {
      $q.loadingBar.start();
      loadingCidadeSelect.value = true;
      optionsServerCidades.value = [];
      await useApi<ICidade>('/cidade')
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

    const fetchCategoria = async () => {
      $q.loadingBar.start();
      loadingCategoriaSelect.value = true;
      optionsServerCategorias.value = [];
      await useApi<ICategoria>('/categoria')
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

    const selectCidadeLabel = (opt: ICidade) => {
      breadcrumbCidade.value = `${opt.nome} - ${opt.uf}`;
      return breadcrumbCidade.value;
    };

    const selectCategoriaLabel = (opt: ICategoria) => {
      breadcrumbCategoria.value = opt.nome;
      return breadcrumbCategoria.value;
    };

    onMounted(() => {
      fetchCidade();
      fetchCategoria();
    });

    const showFiltro = computed(() => {
      return !items.value || items.value?.length == 0; //params.value.text.length <= 3;
    });

    const disableText = computed(() => {
      return (
        !params.value.categoria_id ||
        params.value.categoria_id == 0 ||
        params.value.cidade_id == 0
      );
    });

    const loadMoreItems = async (index, done) => {
      if (params.value.text.length <= 3) {
        if (done) done();
        return;
      }

      if (itemsTotal.value > 0 && itemsTotal.value === itemsLoadTotal.value) {
        if (done) done();
        return;
      }

      try {
        const result: IResult = (await fetchServico()) as IResult;

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

    const fetchServico = async () => {
      if (params.value.text.trim().length == 0) return;
      if (params.value.cidade_id == 0) return;
      if (params.value.categoria_id == 0) return;

      $q.loadingBar.start();
      loadingTextInput.value = true;

      //result.value = null;
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
        useApi<IResult>('/servico-searche')
          .post(_params)
          .then((data: IResult) => {
            resolve(data);
          })
          .catch((e) => {
            $q.loadingBar.stop();
            loadingTextInput.value = false;
            notifyError(e.message); //, JSON.stringify(e));
          })
          .finally(() => {
            $q.loadingBar.stop();
            loadingTextInput.value = false;
          });
      });
    };

    const handleInput = async () => {
      offset.value = 0;
      itemsTotal.value = 0;
      items.value = [];
      await loadMoreItems(0, null);
    };

    watch(params.value, handleInput);

    const onShowLocalizacao = (item: IServico) => {
      const _endereco = `${item.prestador.logradouro}, ${item.prestador.logradouro_numero} - ${item.prestador.bairro}, ${item.prestador.cidade.nome} - ${item.prestador.cidade.uf}, ${item.prestador.cep}`;

      $q.dialog({
        component: LocalizacaoPrestadorDialog,

        // props forwarded to your custom component
        componentProps: {
          endereco: _endereco,
        },
        cancel: true,
      }).onOk((data) => {
        // console.log('>>>> OK, received', data)
      });
    };

    const sendTextWhatsapp = (fone: string, servicoNome: string) => {
      const eu = encodeURI(user?.name || 'Eu');
      const cpf = formatCPF(user?.cpf_cnpj || '');
      const servico = encodeURI(servicoNome);
      const whats = extractNumber(fone);
      return `https://api.whatsapp.com/send?phone=${whats}&text=Ol%C3%A1,%20meu%20nome%20%C3%A9%20*${eu}*%20CPF:%20${cpf}.%20Quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20*${servico}*.`;
    };

    const onAddSolicitacao = (item: IServico) => {
      solicitacaoStore.addItem(item);
    };

    const onDelete = (item: IServico) => {
      solicitacaoStore.deleteItem(item);
    };

    const onEnviar = async (item: IServico) => {
      await solicitacaoStore.enviarItem(item);
    };

    const onEnviarTodos = () => {
      solicitacaoStore.enviarTodosItem();
    };

    return {
      onDelete,
      onEnviar,
      onEnviarTodos,
      onAddSolicitacao,
      solicitacaoStore,
      sendTextWhatsapp,
      formatCel,
      onShowLocalizacao,
      loadMoreItems,
      offset,
      handleInput,
      showFiltro,
      disableText,
      selectCidadeLabel,
      breadcrumbCidade,
      selectCategoriaLabel,
      breadcrumbCategoria,
      params,
      items,
      loading,
      loadingTextInput,
      loadingCidadeSelect,
      loadingCategoriaSelect,
      optionsCidades,
      optionsCategorias,
      msg,
      formatCurrency,

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
