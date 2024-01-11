<template>
  <q-page class="row justify-evenly">
    <div class="q-mt-md">
      <q-card class="my-card bg-white" flat>
        <q-card-section>
          <div class="text-h6 tw-text-ellipsis">{{ tipo.PRESTADOR }}</div>
          <div class="text-subtitle2">Cadastre seus serviços</div>
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
            <q-item
              clickable
              v-ripple
              class="bg-secondary tw-text-gray-100"
              @click="onShowServico"
            >
              <q-item-section avatar>
                <q-icon name="diversity_1" />
              </q-item-section>
              <q-item-section>Serviços</q-item-section>
              <q-item-section side v-if="servicos.length > 0"
                ><q-badge
                  rounded
                  color="warning"
                  :label="servicos.length > 100 ? '100+' : servicos.length"
              /></q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { tipo } from 'src/interfaces';
import ServicoDialog from 'src/components/ServicoDialog.vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import type { IServico } from 'src/interfaces/servico';

export default defineComponent({
  name: 'PrestadorPage',
  setup() {
    const $q = useQuasar();
    const { notifyError } = useNotify();
    const servicos = ref<IServico[]>([]);

    const loadServicos = async () => {
      try {
        $q.loading.show();
        servicos.value = await useApi('/servico').get();
      } catch (error) {
        notifyError(error.message);
      } finally {
        $q.loading.hide();
      }
    };

    onMounted(async () => {
      await loadServicos();
    });

    const onShowServico = async () => {
      $q.dialog({
        component: ServicoDialog,
        componentProps: {
          list: servicos.value,
        },
        cancel: true,
      });
    };

    return {
      tipo,
      servicos,
      onShowServico,
    };
  },
});
</script>
