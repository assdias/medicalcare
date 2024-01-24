<template>
  <q-page class="row justify-evenly">
    <div class="q-mt-md">
      <q-card class="my-card bg-white" flat>
        <q-card-section>
          <div class="text-h6">{{ tipo.PRESTADOR }}</div>
          <div class="text-subtitle2 tw-text-ellipsis tw-text-gray-500">
            Cadastre seus serviços
          </div>
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
              <q-item-section side v-if="countSolicitacoes !== 0">
                <q-badge
                  rounded
                  color="warning"
                  :label="countSolicitacoes > 100 ? '100+' : countSolicitacoes"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="bg-secondary tw-text-gray-100"
              to="/servico"
            >
              <q-item-section avatar>
                <q-icon name="diversity_1" />
              </q-item-section>
              <q-item-section>Serviços</q-item-section>
              <q-item-section side v-if="countServicos !== 0"
                ><q-badge
                  rounded
                  color="warning"
                  :label="countServicos > 100 ? '100+' : countServicos"
              /></q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { tipo } from 'src/interfaces';

export default defineComponent({
  name: 'PrestadorPage',
  metaInfo: {
    requiresPrestador: true,
  },
  setup() {
    const countServicos = computed(() => {
      return 0;
    });

    const countSolicitacoes = computed(() => {
      return 0;
    });

    return {
      countServicos,
      countSolicitacoes,
      tipo,
    };
  },
});
</script>
