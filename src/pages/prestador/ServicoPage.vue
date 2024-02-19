<template>
  <q-page-container>
    <q-page padding style="padding-top: 50px">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="list">
          <q-list>
            <q-item
              v-if="servicos && servicos.length === 0"
              class="tw-text-center tw-text-gray-400"
            >
              Nenhum registro.
            </q-item>
            <q-infinite-scroll @load="loadMoreItems" :offset="offset" v-else>
              <q-item
                v-for="(item, index) in servicos"
                :key="index"
                class="tw-border-t-2 tw-border-t-primary tw-shadow-md tw-my-4 tw-py-3 hover:tw-bg-gray-100"
              >
                <q-item-section>
                  <q-item-label lines="2">
                    <span class="text-weight-medium">{{ item.nome }}</span>
                  </q-item-label>
                  <q-item-label caption class="row tw-justify-between"
                    ><div>{{ item.categoria.nome }}</div>
                    <div>{{ item.referencia }}</div>
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
                        size="12px"
                        flat
                        dense
                        round
                        color="negative"
                        icon="delete"
                        :loading="loading"
                        @click="onRemove(index, item.id)"
                      />
                      <q-btn
                        size="12px"
                        flat
                        dense
                        round
                        icon="edit"
                        @click="onShowEdit(index, item)"
                      />
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
        </q-tab-panel>

        <q-tab-panel name="cad">
          <q-form class="tw-space-y-5" ref="formCadRef">
            <q-card flat>
              <q-card-section class="tw-space-y-3">
                <q-input
                  v-bind="{ ...$themeInputUppercase }"
                  :dense="$q.screen.xs"
                  v-model="servico.nome"
                  label="Serviço"
                  maxlength="100"
                  autofocus
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || msg.REQUERIDO]"
                />
                <q-input
                  v-bind="{ ...$themeInput }"
                  :dense="$q.screen.xs"
                  v-model="servico.observacao"
                  label="Descrição"
                  type="textarea"
                  maxlength="500"
                  autogrow
                />
                <q-select
                  v-bind="{ ...$themeSelect }"
                  :dense="$q.screen.xs"
                  v-model="servico.categoria_id"
                  :loading="loadingSelect"
                  label="Categoria"
                  :options="optionsCategorias"
                  option-value="id"
                  option-label="nome"
                  emit-value
                  map-options
                  clearable
                  @filter="categoriaFilterFn"
                  @filter-abort="categoriaAbortFilterFn"
                  hint="Selecione uma categoria para o serviço."
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        -) Categoria não encontrada
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-input
                  v-bind="{ ...$themeInput }"
                  :dense="$q.screen.xs"
                  v-model="servico.referencia"
                  label="Referência"
                  maxlength="10"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || msg.REQUERIDO]"
                />
                <div class="tw-columns-2">
                  <div>
                    <QCurrencyInput
                      v-model="servico.valor"
                      label="Valor"
                      :dense="$q.screen.xs"
                    />
                  </div>
                  <div>
                    <q-input
                      v-bind="{ ...$themeInput }"
                      :dense="$q.screen.xs"
                      v-model="servico.vigencia_dt"
                      :formatter="formatDateBR"
                      :parser="dateToDateTimeUTCString"
                      label="Vigência"
                      type="date"
                    />
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions class="tw-justify-end">
                <q-btn
                  flat
                  color="accent"
                  label="Salvar"
                  icon="done"
                  @click="onOKClick"
                  v-show="tab == 'cad'"
                />
              </q-card-actions>
            </q-card>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>

      <q-page-sticky expand position="top">
        <q-card class="tw-w-full">
          <q-card-section :class="$q.screen.xs ? 'q-pa-sm' : 'q-pa-md'">
            <q-toolbar class="q-pa-md">
              <q-btn round flat icon="arrow_back" @click="onVoltar">
                <q-tooltip>Voltar</q-tooltip>
              </q-btn>
              <q-toolbar-title>Serviços</q-toolbar-title>
              <q-space />
              <q-btn
                v-show="tab == 'list'"
                color="warning"
                round
                icon="add"
                @click="onNovo"
              />
            </q-toolbar>
          </q-card-section>
        </q-card>
      </q-page-sticky>
    </q-page>
  </q-page-container>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref, defineComponent, onMounted } from 'vue';
import QCurrencyInput from 'src/components/ui/QCurrencyInput.vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { msg } from 'src/interfaces';
import type { IServico, ISoftDelete, IResultAbstract } from 'src/interfaces';
import { useAuthStore } from 'src/stores/auth-store';
import {
  formatDate,
  dateToDateTimeUTCString,
  formatDateBR,
} from 'src/utils/dateUtils';
import { formatCurrency } from 'src/utils/numberUtils';
import { useRouter } from 'vue-router';

export interface IResult extends IResultAbstract {
  items: IServico[];
}

export default defineComponent({
  name: 'ServicoPage',
  components: { QCurrencyInput },
  metaInfo: {
    requiresPrestador: true,
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const tab = ref('list');
    const formCadRef = ref(null);
    const loading = ref(false);
    const { notifyError, notifySuccess } = useNotify();
    const servicoIndex = ref(-1);
    const servico = ref<IServico | null>(null);
    const optionsCategorias = ref(null);
    const loadingSelect = ref(false);

    //const result = ref<IResult | null>(null);
    const servicos = ref<IServico[]>([]);

    const offset = ref(0);
    const limit = 25; // Adjust the limit as needed
    const itemsTotal = ref(0);
    const itemsLoadTotal = ref(0);

    const fetchServico = async () => {
      const params = `/servico?limit=${limit}&offset=${offset.value}`;

      return new Promise((resolve) => {
        useApi<IResult>(params)
          .get()
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

      /*
      try {
        $q.loading.show();
        servicos.value = await useApi<IServico[]>('/servico').get();
      } catch (error) {
        notifyError(error.message);
      } finally {
        $q.loading.hide();
      }
      */
    };

    onMounted(async () => {
      await loadMoreItems();
    });

    const loadMoreItems = async (index, done) => {
      if (itemsTotal.value > 0 && itemsTotal.value === itemsLoadTotal.value) {
        if (done) done();
        return;
      }

      try {
        const result: IResult = (await fetchServico()) as IResult;

        itemsLoadTotal.value = result.items ? result.items.length : 0;
        itemsTotal.value = result.itemsTotal;

        if (result.items.length > 0) {
          servicos.value.push(...result.items);

          offset.value += limit;
        }
      } finally {
        if (done) done();
      }
    };

    const onShowEdit = (index, item) => {
      servicoIndex.value = index;
      servico.value = item;

      servico.value.vigencia_dt = formatDate(item.vigencia_dt);

      optionsCategorias.value = [
        { id: item.categoria_id, nome: item.categoria.nome },
      ];

      tab.value = 'cad';
    };

    const onRemove = (index, id) => {
      $q.dialog({
        title: 'Confirm',
        message: 'Deseja realmente excluir ?',
        cancel: { label: 'Não', color: 'negative', flat: true },
        ok: 'Sim',
        persistent: true,
      }).onOk(async () => {
        try {
          loading.value = true;
          $q.loading.show({ message: 'Aguarde, excluindo...' });

          await useApi<ISoftDelete>('/servico').remove({ id: id });
          servicos.value.splice(index, 1);

          notifySuccess('Registro removido');
        } catch (error) {
          notifyError(error.message);
        } finally {
          loading.value = false;
          $q.loading.hide();
        }
      });
    };

    const createFormData = () => {
      const formData = new FormData();

      formData.append('prestador_id', useAuthStore().user.id);
      formData.append('nome', servico.value.nome.toUpperCase());
      formData.append('valor', servico.value.valor);
      formData.append('observacao', servico.value.observacao);
      formData.append('categoria_id', servico.value.categoria_id);
      formData.append('referencia', servico.value.referencia);

      formData.append(
        'vigencia_dt',
        dateToDateTimeUTCString(servico.value.vigencia_dt)
      );

      return formData;
    };

    const updateServico = async (formData) => {
      const data = await useApi<IServico>('/servico').patch({
        id: servico.value.id,
        body: formData,
      });
      servicos.value[servicoIndex.value] = data;
      servicoIndex.value = -1;
    };

    const createServico = async (formData) => {
      const data = await useApi<IServico>('/servico').post(formData);
      servicos.value.push(data);
    };

    const submitForm = async () => {
      try {
        loading.value = true;
        $q.loading.show({ message: 'Aguarde, salvando...' });
        const formData = createFormData();

        if (servico.value.id > 0) {
          await updateServico(formData);
        } else {
          await createServico(formData);
        }

        tab.value = 'list';
        notifySuccess(
          servico.value.id > 0 ? 'Registro atualizado' : 'Registro salvo'
        );
      } catch (error) {
        notifyError(error.message);
      } finally {
        loading.value = false;
        $q.loading.hide();
      }
    };

    const onNovo = () => {
      if (formCadRef.value) {
        formCadRef.value.reset();
      }

      servico.value = {
        nome: '',
        valor: 0,
      };

      tab.value = 'cad';
    };

    const onVoltar = () => {
      if (tab.value === 'cad') {
        tab.value = 'list';
      } else {
        router.push('/prestador');
      }
    };
    return {
      loadMoreItems,
      onVoltar,
      formatCurrency,
      formatDate,
      formatDateBR,
      dateToDateTimeUTCString,
      offset,
      loading,
      servicos,
      servico,
      tab,
      msg,
      formCadRef,
      onShowEdit,
      onRemove,
      onNovo,

      loadingSelect,
      optionsCategorias,

      async onOKClick() {
        formCadRef.value.validate();

        if (await formCadRef.value.validate()) {
          await submitForm();
        }
      },

      categoriaFilterFn(val, update, abort) {
        if (optionsCategorias.value !== null) {
          // already loaded
          update();
          return;
        }

        abort(() => {
          loadingSelect.value = false;
        });

        update(async () => {
          /*
          loadingSelect.value = true;
          await useApi('/categoria')
            .get()
            .then((data) => {
              optionsCategorias.value = data;
            })
            .finally(() => {
              loadingSelect.value = false;
            });*/

          try {
            loadingSelect.value = true;

            const data = await useApi('/categoria').get();
            optionsCategorias.value = data;
          } catch (error: any) {
            notifyError(error.message);
          } finally {
            loadingSelect.value = false;
          }
        });
      },

      categoriaAbortFilterFn() {
        // console.log('delayed filter aborted')
        loadingSelect.value = false;
      },
    };
  },
});
</script>
