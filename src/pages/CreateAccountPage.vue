<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-mt-md">
      <q-card class="my-card" flat>
        <q-btn
          icon="arrow_back"
          round
          flat
          color="primary"
          class="q-mt-sm"
          @click="$router.replace('/')"
        />
        <q-card-section>
          <div class="text-h5">Junte-se a nós</div>
          <div class="text-subtitle3 q-mt-md tw-text-ellipsis tw-text-gray-500">
            Crie sua conta e tenha acesso aos melhores prestadores de saúde.
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="tw-space-y-5" autofocus greedy @submit="handleSubmit">
            <q-input
              v-bind="{ ...$themeInputUppercase }"
              v-model="body.name"
              label="Nome"
              hint="Informe nome e sobrenome."
              maxlength="100"
              autofocus
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Informe seu nome']"
            />
            <q-input
              v-bind="{ ...$themeInputLowercase }"
              v-model="body.email"
              type="email"
              label="E-mail"
              hint="Informe um e-mail válido."
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

            <q-select
              v-bind="{ ...$themeSelect }"
              v-model="body.cidade_id"
              :loading="loadingSelect"
              label="Cidade"
              :options="optionsCidades"
              option-value="id"
              :option-label="
                (opt) =>
                  Object(opt) === opt && 'nome' in opt
                    ? `${opt.nome} - ${opt.uf}`
                    : null
              "
              emit-value
              map-options
              @filter="filterFn"
              @filter-abort="abortFilterFn"
              hint="Selecione uma cidade onde temos cobertura."
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    -) Cidade não encontrada
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="text-center">
              <q-radio
                v-bind="{ ...$themeRadio }"
                v-model="body.tipo"
                :val="tipo.BENEFICIARIO"
                :label="tipo.BENEFICIARIO"
              />
              <q-radio
                v-bind="{ ...$themeRadio }"
                v-model="body.tipo"
                :val="tipo.PRESTADOR"
                :label="tipo.PRESTADOR"
              />
            </div>

            <q-btn
              v-bind="{ ...$themeBtnPrimary }"
              :loading="loading"
              :flat="false"
              size="lg"
              unelevated
              label="Criar conta"
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
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { tipo } from 'src/interfaces';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CreateAccountPage',
  setup() {
    const loading = ref(false);
    const loadingSelect = ref(false);
    const isPwd = ref(true);
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const optionsCidades = ref(null);
    const body = ref({
      name: '',
      email: '',
      password: '',
      cidade_id: null,
      tipo: tipo.BENEFICIARIO,
      location: null,
    });

    onMounted(() => {
      useAuthStore().getCurrentPosition();
    });

    const handleSubmit = async () => {
      try {
        loading.value = true;
        body.value.location = useAuthStore().coords;

        body.value.name = body.value.name.toUpperCase();
        body.value.email = body.value.email.toLowerCase();

        const data = await useApi('/auth/signup').post(body.value);

        if (data) {
          notifySuccess('Registro criado com sucesso :)');

          useAuthStore().logout();
          useAuthStore().setToken(data.authToken);
          await useAuthStore().updateUser();

          if (useAuthStore().user.tipo == tipo.BENEFICIARIO) {
            router.push('/beneficiario');
          } else if (useAuthStore().user.tipo == tipo.PRESTADOR) {
            router.push('/prestador');
          } else if (useAuthStore().user.tipo == tipo.OPERADOR) {
            router.push('/operador');
          } else {
            notifyError('Tipo do usuário não definido.');
            router.push('/');
          }
        }
      } catch (error: any) {
        notifyError(error.message);
      } finally {
        loading.value = false;
      }
    };

    return {
      isPwd,
      tipo,
      body,
      loading,
      handleSubmit,
      optionsCidades,

      filterFn(val, update, abort) {
        if (optionsCidades.value !== null) {
          // already loaded
          update();
          return;
        }

        update(async () => {
          try {
            loadingSelect.value = true;

            const data = await useApi('/cidade').get();
            optionsCidades.value = data;
          } catch (error: any) {
            notifyError(error.message);
          } finally {
            loadingSelect.value = false;
          }
        });
      },

      abortFilterFn() {
        // console.log('delayed filter aborted')
      },
    };
  },
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 320px
</style>
