<template>
  <q-page class="row justify-evenly">
    <div class="q-mt-md">
      <q-card class="my-card bg-white" flat >
          <q-card-section>
            <div class="text-h6 tw-text-ellipsis">Operador</div>
            <div class="text-subtitle2">Configure sua rede</div>
          </q-card-section>
        <q-card-section>
          <q-list separator class="tw-space-y-2 tw-text-lg">
            <q-item clickable v-ripple class="bg-primary tw-text-gray-100 tw-mb-5">
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>
              <q-item-section>Solicitações</q-item-section>
              <q-item-section side><q-badge rounded color="warning" label="999+" /></q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
              <q-item-section avatar>
                <q-icon name="diversity_1" />
              </q-item-section>
              <q-item-section>Beneficiários</q-item-section>
              <q-item-section side><q-badge rounded color="warning" label="1" /></q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
              <q-item-section avatar>
                <q-icon name="sort_by_alpha" />
              </q-item-section>
              <q-item-section>Clsssificação</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
              <q-item-section avatar>
                <q-icon name="science" />
              </q-item-section>
              <q-item-section>Especialidade</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-secondary tw-text-gray-100">
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OperadorPage',
  setup () {
    return {  };
  }
});
</script>
