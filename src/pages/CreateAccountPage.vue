<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-mt-md">
      <q-card class="my-card" flat>
        <q-btn icon="arrow_back" round flat color="primary" class="q-mt-sm" @click="$router.replace('/')" />
          <q-card-section>
            <div class="text-h5 tw-text-ellipsis">Junte-se a nós</div>
            <div class="text-subtitle3 q-mt-md">Crie sua conta e tenha acesso aos melhores prestadores de saúde.</div>
          </q-card-section>
        <q-card-section>
          <q-form class="tw-space-y-5" autofocus greedy @submit="handleSubmit">
            <q-input filled v-model="body.name" label="Nome" hint="Informe nome e sobrenome."/>
            <q-input filled v-model="body.email" type="email" label="E-mail" hint="Informe um e-mail válido."/>
            <q-input filled v-model="body.password" :type="isPwd ? 'password' : 'text'" label="Senha" hint="Senha com no mínimo 8 caracteres.">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-select
              filled
              v-model="body.cidade_id"
              label="Cidade"
              :options="optionsCidades"
              option-value="id"
              option-label="nome"
              emit-value
              map-options
              @filter="filterFn"
              @filter-abort="abortFilterFn"
              hint="Selecione uma cidade onde temos cobertura."
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="text-center">
              <q-radio v-model="body.tipo" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Beneficiário" label="Beneficiário" />
              <q-radio v-model="body.tipo" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Prestador" label="Prestador" />
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
import { defineComponent, ref } from 'vue';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import getLocation from 'src/utils/geolocation';
//import { useAuthStore } from 'src/stores/auth-store';
//import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CreateAccountPage',
  setup () {
    const loading = ref(false);
    const isPwd = ref(true);
    const { notifyError, notifySuccess } = useNotify();
    const optionsCidades = ref(null);
    const body = ref({
      name: '',
      email: '',
      password: '',
      cidade_id: null,
      tipo: 'Beneficiário'
    });
/*
    const localCoord = ref({
      latitude: '',
      longitude: ''
    });

    const setPosition = async() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, this.errorPosition)
      }
    }
*/
    const handleSubmit = async () => {
      try {
        loading.value = true;

        console.log(body.value);
/*
        getLocation()

        const coords = position.coords;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(setPosition, this.errorPosition)
        }
*/
        const data = await useApi('/auth/signup').post(
          body.value
        );

        console.log(data);
        notifySuccess('Registro criado com sucesso :)');

      } catch (error: any) {
        console.log(error);
        notifyError(error);
      } finally {
        loading.value = false;
      }
    };

    return {
      isPwd,
      body,
      loading,
      handleSubmit,
      optionsCidades,

      filterFn (val, update, abort) {
        if (optionsCidades.value !== null) {
          // already loaded
          update()
          return
        }

        update(async() => {
          try {
            loading.value = true;

            const data = await useApi('/cidade').get();
            optionsCidades.value =  data;

          } catch (error: any) {
            notifyError(error);
          } finally {
            loading.value = false;
          }

        })
      },

      abortFilterFn () {
        // console.log('delayed filter aborted')
      }

    };
  }
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 320px
</style>
