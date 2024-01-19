<template>
  <q-page class="row justify-evenly">
    <div class="q-mt-md">
      <q-card class="my-card bg-white" flat>
        <q-card-section>
          <div class="text-h6">{{ tipo.BENEFICIARIO }}</div>
          <div class="text-subtitle2 tw-text-ellipsis tw-text-gray-500">
            Tudo que você precisa está aqui :)
          </div>
        </q-card-section>
        <q-card-section>
          <q-list separator class="tw-space-y-2 tw-text-lg">
            <q-item
              clickable
              v-ripple
              class="bg-primary tw-text-gray-100 tw-mb-5"
              @click="$router.push('/pesquisar')"
            >
              <q-item-section avatar>
                <q-icon name="search" />
              </q-item-section>
              <q-item-section>Pesquisar</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
              <q-item-section avatar>
                <q-icon name="support_agent" />
              </q-item-section>
              <q-item-section>Autorizações</q-item-section>
              <q-item-section side
                ><q-badge rounded color="warning" label="999+"
              /></q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
              <q-item-section avatar>
                <q-icon name="info" />
              </q-item-section>
              <q-item-section>Informações</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
              <q-item-section avatar>
                <q-icon name="diversity_1" />
              </q-item-section>
              <q-item-section>Grupo</q-item-section>
              <q-item-section side
                ><q-badge rounded color="warning" label="1"
              /></q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { tipo } from 'src/interfaces';
import PesquisarDialog from 'src/components/PesquisarDialog.vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PesquisarServicosPage',
  metaInfo: {
    requiresBeneficario: true,
  },
  setup() {
    const $q = useQuasar();

    const onPesquisar = () => {
      $q.dialog({
        component: PesquisarDialog,
        componentProps: {
          // list: servicos.value,
        },
        cancel: true,
      });
    };

    return {
      tipo,
      onPesquisar,
    };
  },
});
</script>
