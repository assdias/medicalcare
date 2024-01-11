<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-bar>
        <q-btn
          round
          dense
          flat
          icon="arrow_back"
          @click="tab = 'list'"
          v-show="tab == 'cad'"
        />
        <div>Serviços</div>

        <q-space />

        <q-btn round dense flat icon="close" v-close-popup>
          <q-tooltip>Fechar</q-tooltip>
        </q-btn>
      </q-bar>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <!-- <q-tab name="list" label="Listagem" />
        <q-tab name="cad" label="Cadastro" />-->
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="list">
          <q-scroll-area style="height: 400px; width: 100%">
            <div
              v-show="servicos.length === 0"
              class="tw-text-center tw-text-gray-400"
            >
              Nenhum registro.
            </div>
            <q-list
              v-for="(item, index) in servicos"
              :index="index"
              :key="item.id"
              style="max-width: 369px"
            >
              <q-item
                clickable
                class="tw-border-t-2 tw-border-t-primary tw-shadow-md tw-mt-4"
              >
                <q-item-section avatar center>
                  <q-icon name="science" size="34px" class="text-grey-8" />
                </q-item-section>

                <q-item-section center>
                  <q-item-label lines="1">
                    <span class="text-weight-medium">{{ item.nome }}</span>
                  </q-item-label>
                  <q-item-label caption class="row tw-justify-between"
                    ><div>{{ item.categoria.nome }}</div>
                    <div>{{ item.referencia }}</div></q-item-label
                  >
                  <div class="row tw-justify-end">
                    <span color="blue" class="tw-font-semibold tw-text-base">{{
                      formatCurrency(item.valor)
                    }}</span>
                  </div>
                </q-item-section>

                <q-item-section side center>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn
                      class="gt-xs"
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
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="edit"
                      @click="onShowEdit(index, item)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="cad">
          <q-form class="tw-space-y-5" ref="formCadRef">
            <q-input
              v-bind="{ ...$themeInputUppercase }"
              v-model="servico.nome"
              label="Serviço"
              maxlength="100"
              autofocus
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || msg.REQUERIDO]"
            />
            <q-input
              v-bind="{ ...$themeInput }"
              v-model="servico.descricao"
              label="Descrição"
              type="textarea"
              maxlength="500"
              autogrow
            />
            <q-select
              v-bind="{ ...$themeSelect }"
              v-model="servico.categoria_id"
              :loading="loadingSelect"
              label="Categoria"
              :options="optionsCategorias"
              option-value="id"
              option-label="nome"
              emit-value
              map-options
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
              v-model="servico.referencia"
              label="Referência"
              maxlength="10"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || msg.REQUERIDO]"
            />
            <div class="tw-columns-2">
              <div>
                <QCurrencyInput v-model="servico.valor" label="Valor" />
              </div>
              <div>
                <q-input
                  v-bind="{ ...$themeInput }"
                  v-model="servico.vigencia_dt"
                  :formatter="formatDateBR"
                  :parser="dateToDateTimeUTCString"
                  label="Vigência"
                  type="date"
                />
              </div>
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
      <q-separator />
      <q-card-actions class="tw-justify-end">
        <q-btn
          flat
          v-show="tab == 'list'"
          color="secondary"
          icon="add"
          label="Novo"
          @click="onNovo"
        />

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
  </q-dialog>
</template>
<script lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { ref, defineComponent } from 'vue';
import QCurrencyInput from 'src/components/ui/QCurrencyInput.vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { msg } from 'src/interfaces';
import type { IServico } from 'src/interfaces/servico';
import { useAuthStore } from 'src/stores/auth-store';
import {
  formatDate,
  dateToDateTimeUTCString,
  formatDateBR,
} from 'src/utils/dateUtils';
import { formatCurrency } from 'src/utils/numberUtils';

export default defineComponent({
  name: 'ServicoDialog',
  components: { QCurrencyInput },
  props: {
    list: {
      type: Array<IServico>,
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
    const tab = ref('list');
    const formCadRef = ref(null);
    const loading = ref(false);
    const { notifyError, notifySuccess } = useNotify();
    const servicoIndex = ref(-1);
    const { list } = props;
    const servico = ref<IServico | null>(null);
    const servicos = ref<IServico[]>(list);
    const optionsCategorias = ref(null);
    const loadingSelect = ref(false);

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

          await useApi('/servico').remove(id);
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
      formData.append('descricao', servico.value.descricao);
      formData.append('categoria_id', servico.value.categoria_id);
      formData.append('referencia', servico.value.referencia);

      formData.append(
        'vigencia_dt',
        dateToDateTimeUTCString(servico.value.vigencia_dt)
      );

      return formData;
    };

    const updateServico = async (formData) => {
      const data = await useApi('/servico').patch(servico.value.id, formData);
      servicos.value[servicoIndex.value] = data;
      servicoIndex.value = -1;
    };

    const createServico = async (formData) => {
      const data = await useApi('/servico').post(formData);
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

    return {
      formatCurrency,
      formatDate,
      formatDateBR,
      dateToDateTimeUTCString,
      loading,
      servicos,
      servico,
      tab,
      msg,
      formCadRef,
      onShowEdit,
      onRemove,
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      onNovo,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      async onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)

        formCadRef.value.validate();

        if (await formCadRef.value.validate()) {
          await submitForm();
        }

        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      loadingSelect,
      optionsCategorias,

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
