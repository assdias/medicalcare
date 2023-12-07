<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="my-card">
      <q-img src="~assets/logo.webp"/>
      <q-card-section>
        <div class="text-h6">MedicalCare</div>
        <div class="text-subtitle2">Seus planos em um só lugar</div>
      </q-card-section>
      <q-card-section>
        <q-form class="tw-space-y-5" autofocus greedy @submit="handleSubmit">
          <q-input filled v-model="body.email" type="email" label="E-mail" />
          <q-input filled v-model="body.password" type="password" label="Senha" />

          <q-btn
              v-bind="{ ...$themeBtnPrimary }"
              :loading="loading"
              :flat="false"
              size="lg"
              unelevated
              label="Entrar"
              class="full-width"
              type="submit"
            >
              <template v-slot:loading>
                <q-spinner-dots />
              </template>
            </q-btn>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import useNotify from 'src/composables/UseNotify';

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const { notifyError, notifySuccess } = useNotify();
    const router = useRouter();
    const authStore = useAuthStore();
    const loading = ref(false);
    const success = ref(false);
    const body = ref({
      email: '',
      password: ''
    });

    onMounted(() => {
      body.value.email = authStore.email;
    });

    const handleSubmit = async () => {
      try {
        loading.value = true;

        success.value = await authStore.login(
          body.value.email,
          body.value.password
        );

        if (success.value == true) {
          notifySuccess('Seja bem-vindo ....');
        }

        if (authStore.user.tipo == 'Beneficiário') {
          router.push('/beneficiario')
        } else if (authStore.user.tipo == 'Prestador') {
          router.push('/prestador');
        } else if (authStore.user.tipo == 'Operador') {
          router.push('/operador');
        } else {
          notifyError('Tipo do usuário não definido.');
          router.push('/');
        }

      } catch (error: any) {
        notifyError(error);
      } finally {
        loading.value = false;
      }

    };

    return { loading, body, handleSubmit };
  }
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 320px
</style>
