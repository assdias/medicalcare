<template>
  <q-page class="row justify-evenly">
    <div class="q-mt-md">
      <q-card class="my-card bg-white" flat>
        <q-card-section>
          <div class="text-h6 tw-text-ellipsis">{{ tipo.BENEFICIARIO }}</div>
          <div class="text-subtitle2">
            Pesquise por médicos, expecialistas, clinicas...
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

export default defineComponent({
  name: 'BeneficiarioPage',
  setup() {
    return { tipo };
  },
});
</script>
