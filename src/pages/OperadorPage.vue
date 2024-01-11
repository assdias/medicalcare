<template>
  <q-page class="row justify-evenly">
    <div class="q-mt-md">
      <q-card class="my-card bg-white" flat>
        <q-card-section>
          <div class="text-h6 tw-text-ellipsis">{{ tipo.OPERADOR }}</div>
          <div class="text-subtitle2">Configure sua rede</div>
        </q-card-section>
        <q-card-section>
          <q-list separator class="tw-space-y-2 tw-text-lg">
            <q-item
              clickable
              v-ripple
              class="bg-primary tw-text-gray-100 tw-mb-5"
            >
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>
              <q-item-section>Solicitações</q-item-section>
              <q-item-section side
                ><q-badge rounded color="warning" label="999+"
              /></q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
              <q-item-section avatar>
                <q-icon name="diversity_1" />
              </q-item-section>
              <q-item-section>Beneficiários</q-item-section>
              <q-item-section side
                ><q-badge rounded color="warning" label="1"
              /></q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="bg-secondary tw-text-gray-100"
              @click="onShowCategoria"
            >
              <q-item-section avatar>
                <q-icon name="category" />
              </q-item-section>
              <q-item-section>Categoria</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="bg-secondary tw-text-gray-100"
              @click="onShowClassificacao"
            >
              <q-item-section avatar>
                <q-icon name="sort_by_alpha" />
              </q-item-section>
              <q-item-section>Clsssificação</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="bg-secondary tw-text-gray-100"
              @click="onShowEspecialidade"
            >
              <q-item-section avatar>
                <q-icon name="science" />
              </q-item-section>
              <q-item-section>Especialidade</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="bg-secondary tw-text-gray-100"
              @click="onShowCidade"
            >
              <q-item-section avatar>
                <q-icon name="place" />
              </q-item-section>
              <q-item-section>Cidades</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
              <q-item-section avatar>
                <q-icon name="diamond" />
              </q-item-section>
              <q-item-section>Planos</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent /*, onMounted, ref */ } from 'vue';
import { useQuasar } from 'quasar';
import { tipo } from 'src/interfaces';
import CidadadeDialog from 'src/components/CidadadeDialog.vue';
import CategoriaDialog from 'src/components/CategoriaDialog.vue';
import ClassificacaoDialog from 'src/components/ClassificacaoDialog.vue';
import EspecialidadeDialog from 'src/components/EspecialidadeDialog.vue';

import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';

export default defineComponent({
  name: 'OperadorPage',
  setup() {
    const $q = useQuasar();
    const { notifyError } = useNotify();

    return {
      tipo,

      async onShowEspecialidade() {
        try {
          $q.loading.show();
          const especialidades = await useApi('/especialidade').get();

          $q.dialog({
            component: EspecialidadeDialog,

            // props forwarded to your custom component
            componentProps: {
              list: especialidades,
            },
            cancel: true,
          }).onOk((data) => {
            // console.log('>>>> OK, received', data)
          });
        } catch (error) {
          notifyError(error.message);
        } finally {
          $q.loading.hide();
        }
      },
      async onShowClassificacao() {
        try {
          $q.loading.show();
          const classificacoes = await useApi('/classificacao').get();

          $q.dialog({
            component: ClassificacaoDialog,

            // props forwarded to your custom component
            componentProps: {
              list: classificacoes,
            },
            cancel: true,
          }).onOk((data) => {
            // console.log('>>>> OK, received', data)
          });
        } catch (error) {
          notifyError(error.message);
        } finally {
          $q.loading.hide();
        }
      },
      async onShowCategoria() {
        try {
          $q.loading.show();
          const categorias = await useApi('/categoria').get();

          $q.dialog({
            component: CategoriaDialog,

            // props forwarded to your custom component
            componentProps: {
              list: categorias,
            },
            cancel: true,
          }).onOk((data) => {
            // console.log('>>>> OK, received', data)
          });
        } catch (error) {
          notifyError(error.message);
        } finally {
          $q.loading.hide();
        }
      },
      async onShowCidade() {
        try {
          $q.loading.show();
          const cidades = await useApi('/cidade').get();

          $q.dialog({
            component: CidadadeDialog,

            // props forwarded to your custom component
            componentProps: {
              list: cidades,
            },
            cancel: true,
          }).onOk((data) => {
            // console.log('>>>> OK, received', data)
          });
        } catch (error) {
          notifyError(error.message);
        } finally {
          $q.loading.hide();
        }
      },
    };
  },
});
</script>
