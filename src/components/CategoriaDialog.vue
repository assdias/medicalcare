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
        <div>Categoria</div>

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
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="list">
          <div
            v-if="categorias.length === 0"
            class="tw-text-center tw-text-gray-400"
          >
            Nenhum registro.
          </div>
          <div v-else>
            <q-virtual-scroll
              style="max-height: 400px"
              :items="categorias"
              v-slot="{ item, index }"
            >
              <q-item
                :key="index"
                clickable
                class="tw-border-t-2 tw-border-t-primary tw-shadow-md tw-mt-4"
              >
                <q-item-section avatar center class="gt-xs">
                  <q-icon name="category" size="34px" class="text-grey-8" />
                </q-item-section>

                <q-item-section center>
                  <q-item-label lines="1">
                    <span class="text-weight-medium">{{ item.nome }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side center>
                  <div class="text-grey-8 q-gutter-xs flex tw-flex-col">
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
              </q-item>
            </q-virtual-scroll>
          </div>
        </q-tab-panel>

        <q-tab-panel name="cad">
          <q-form class="tw-space-y-5" ref="formCadRef">
            <q-input
              v-bind="{ ...$themeInputUppercase }"
              v-model="categoria.nome"
              label="Categoria"
              maxlength="100"
              autofocus
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || msg.REQUERIDO]"
            />
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
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { useQuasar } from 'quasar';
import type { ICategoria, ISoftDelete } from 'src/interfaces';
import { msg } from 'src/interfaces';

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
    // defineProps<{ categorias: ICategoria[] }>();

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
    const categoriaIndex = ref(-1);
    const categoria = ref({ id: null, nome: '' });
    const categorias = ref(null);
    categorias.value = props.list;

    const onShowEdit = (index, item) => {
      categoriaIndex.value = index;
      categoria.value.id = item.id;
      categoria.value.nome = item.nome;
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
          $q.loading.show({ message: 'Aguarde, excluindo...' });

          await useApi<ISoftDelete>('/categoria').remove({ id: id });
          categorias.value.splice(index, 1);

          notifySuccess('Registro removido');
        } catch (error) {
          notifyError(error.message);
        } finally {
          $q.loading.hide();
        }
      });
    };

    return {
      loading,
      categorias,
      categoria,
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

      onNovo() {
        categoria.value.id = null;
        categoria.value.nome = '';
        tab.value = 'cad';
      },

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)

        formCadRef.value.validate().then(async (success) => {
          if (success) {
            try {
              loading.value = true;

              categoria.value.nome = categoria.value.nome.toUpperCase();

              if (categoria.value.id > 0) {
                await useApi<ICategoria>('/categoria').patch({
                  id: categoria.value.id,
                  body: categoria.value,
                });
                categorias.value[categoriaIndex.value] = categoria.value;
                categoriaIndex.value = -1;
                notifySuccess('Registro atualizado');
              } else {
                const data = await useApi<ICategoria>('/categoria').post(
                  categoria.value
                );
                categorias.value.push(data);
                notifySuccess('Registro salvo');
              }

              tab.value = 'list';
              //onDialogOK({});
            } catch (error) {
              notifyError(error.message);
            } finally {
              loading.value = false;
            }
          }
        });

        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
};
</script>
