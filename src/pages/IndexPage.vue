<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="my-card" flat>
      <div class="text-center tw-h-40">
        <q-img
          src="~assets/logo.webp"
          style="height: 200px; max-width: 200px"
        />
      </div>
      <q-card-section>
        <div class="text-h6">MedicalCare</div>
        <div class="text-subtitle2">Seus planos em um só lugar</div>
      </q-card-section>
      <q-card-section>
        <q-form class="tw-space-y-5" autofocus greedy @submit="handleSubmit">
          <q-input
            v-bind="{ ...$themeInputLowercase }"
            v-model="body.email"
            type="email"
            label="E-mail"
            autofocus
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Informe um E-mail']"
          />

          <q-input
            v-bind="{ ...$themeInput }"
            v-model="body.password"
            :type="isPwd ? 'password' : 'text'"
            label="Senha"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length >= 8) ||
                'Informe uma senha com no mínimo 8 caracteres',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

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

          <div class="text-center tw-text-gray-400">
            Não tem uma conta?
            <a
              class="text-primary tw-font-semibold tw-cursor-pointer"
              @click="$router.replace('/createaccount')"
              >Inscreva-se aqui</a
            >
          </div>
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
import { tipo } from 'src/interfaces';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { notifyError, notifySuccess } = useNotify();
    const router = useRouter();
    const authStore = useAuthStore();
    const loading = ref(false);
    const success = ref(false);
    const isPwd = ref(true);
    const body = ref({
      email: '',
      password: '',
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

        if (authStore.user.tipo == tipo.BENEFICIARIO) {
          router.push('/beneficiario');
        } else if (authStore.user.tipo == tipo.PRESTADOR) {
          router.push('/prestador');
        } else if (authStore.user.tipo == tipo.OPERADOR) {
          router.push('/operador');
        } else {
          notifyError('Tipo do usuário não definido.');
          router.push('/');
        }
      } catch (error: any) {
        notifyError(error.message);
      } finally {
        loading.value = false;
      }
    };

    return { loading, isPwd, body, handleSubmit };
  },
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 320px
</style>
