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
        <div>Classificação</div>

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
              v-show="classificacoes.length === 0"
              class="tw-text-center tw-text-gray-400"
            >
              Nenhum registro.
            </div>
            <q-list
              v-for="(item, index) in classificacoes"
              :index="index"
              :key="item.id"
            >
              <q-item
                clickable
                class="tw-border-t-2 tw-border-t-primary tw-shadow-md tw-mt-4"
              >
                <q-item-section avatar top>
                  <q-icon
                    name="sort_by_alpha"
                    size="34px"
                    class="text-grey-8"
                  />
                </q-item-section>

                <q-item-section center>
                  <q-item-label lines="1">
                    <span class="text-weight-medium">{{ item.nome }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section top side>
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
              v-model="classificacao.nome"
              label="Classificação"
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

<script>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { useQuasar } from 'quasar';
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
    const classificacaoIndex = ref(-1);
    const classificacao = ref({
      id: null,
      nome: '',
    });

    const classificacoes = ref(null);
    classificacoes.value = props.list;

    const onShowEdit = (index, item) => {
      classificacaoIndex.value = index;
      classificacao.value.id = item.id;
      classificacao.value.nome = item.nome;
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

          await useApi('/classificacao').remove(id);
          classificacoes.value.splice(index, 1);

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
      classificacoes,
      props,
      classificacao,
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
        classificacao.value.id = null;
        classificacao.value.nome = '';
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

              classificacao.value.nome = classificacao.value.nome.toUpperCase();

              if (classificacao.value.id > 0) {
                await useApi('/classificacao').patch(
                  classificacao.value.id,
                  classificacao.value
                );
                classificacoes.value[classificacaoIndex.value] =
                  classificacao.value;
                classificacaoIndex.value = -1;
                notifySuccess('Registro atualizado');
              } else {
                const data = await useApi('/classificacao').post(
                  classificacao.value
                );
                classificacoes.value.push(data);
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

      optionsUF: [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MS',
        'MT',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
      ],
    };
  },
};
</script>
