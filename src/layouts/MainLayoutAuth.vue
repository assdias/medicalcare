<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
      class="tw-bg-gradient-to-r tw-from-primary tw-via-teal-300 tw-to-secondary"
      :class="showHeaderDetail ? 'tw-h-52' : ''"
    >
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>
        <q-toolbar-title> Medical Care </q-toolbar-title>

        <q-btn flat round dense icon="person" @click="ShowUser = true" />
        <q-btn flat round dense icon="logout" @click="handleLogout" />
      </q-toolbar>

      <div class="flex justify-center tw-w-full" v-if="showHeaderDetail">
        <div class="text-center tw-w-full">
          <q-img
            class="tw-rounded-full tw-border-2 tw-border-white"
            :src="imageHeader"
            :placeholder-src="
              user.tipo == tipo.BENEFICIARIO
                ? 'img/perfil.jpg'
                : 'img/seulogo.webp'
            "
            spinner-color="white"
            style="height: 110px; max-width: 110px"
            @click="ShowUser = true"
          />
          <p class="tw-text-sm tw-font-semibold tw-mt-1">
            Olá, {{ user.name }}
          </p>
          <p class="tw-text-xs tw-font-light">{{ user.cpf_cnpj }}</p>
        </div>
      </div>
    </q-header>

    <q-dialog v-model="ShowUser" persistent allowFocusOutside>
      <q-card class="my-card tw-min-h-min" flat>
        <div class="theme-backgroud tw-pb-3">
          <q-card-section class="tw-pb-0">
            <div class="text-h6 text-white tw-text-ellipsis">
              {{ user.email }}
            </div>
            <div class="text-subtitle2 text-white">{{ user.tipo }}</div>
          </q-card-section>

          <div class="text-center tw-w-full">
            <q-img
              :src="imageFile"
              class="tw-rounded-full tw-border-2 tw-border-white"
              :placeholder-src="
                user.tipo == tipo.BENEFICIARIO
                  ? 'img/perfil.jpg'
                  : 'img/seulogo.webp'
              "
              style="height: 170px; max-width: 170px"
            >
            </q-img>
          </div>
        </div>
        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="edit"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
            @click="handleUpload()"
          />
          <q-form autofocus greedy>
            <div class="tw-space-y-1">
              <div class="row no-wrap items-center">
                <div class="col">
                  <q-input
                    v-bind="{ ...$themeInputUppercase }"
                    v-model="body.name"
                    label="Nome"
                    maxlength="100"
                    lazy-rules
                    autofocus
                    :rules="[
                      (val) => (val && val.length > 0) || 'Informe seu nome',
                    ]"
                  />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col">
                  <q-input
                    v-bind="{ ...$themeInput }"
                    v-model="body.cpf_cnpj"
                    :label="user.tipo == tipo.BENEFICIARIO ? 'CPF' : 'CNPJ'"
                    :maxlength="user.tipo == tipo.BENEFICIARIO ? 14 : 18"
                    :mask="
                      user.tipo == tipo.BENEFICIARIO
                        ? '###.###.###-##'
                        : '##.###.###/####-##'
                    "
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        (user.tipo == tipo.BENEFICIARIO
                          ? 'Informe um CPF'
                          : 'Informe um CNPJ'),
                    ]"
                  />
                </div>
              </div>

              <div class="row no-wrap items-center tw-space-x-2">
                <div class="col">
                  <q-input
                    v-bind="{ ...$themeInput }"
                    :clearable="false"
                    v-model="body.fone"
                    label="Fone"
                    type="tel"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                  />
                </div>
                <div class="col">
                  <q-input
                    v-bind="{ ...$themeInput }"
                    :clearable="false"
                    v-model="body.whatsapp"
                    label="Whatsapp"
                    type="tel"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-caption text-grey">
            O e-mail associado a esta conta é:
            <span class="tw-text-gray-500">{{ user.email }}</span>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            label="Salvar"
            :loading="loading"
            icon="done"
            @click="handleUserSave"
          >
            <template v-slot:loading>
              <q-spinner-dots />
            </template>
          </q-btn>
          <q-btn
            v-close-popup
            flat
            color="negative"
            label="Sair"
            icon="close"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
      <!-- place QPageScroller at end of page -->
      <q-page-scroller
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
      >
        <q-btn fab icon="keyboard_arrow_up" color="accent" />
      </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import { useRouter } from 'vue-router';
import { tipo, IUser } from 'src/interfaces';
import { removerAcentos } from 'src/utils/stringUtils';
import { mask } from 'vue-the-mask';

export default defineComponent({
  name: 'MainLayoutAuth',
  metaInfo: {
    requiresAuth: true,
  },
  directives: { mask },
  setup() {
    const router = useRouter();
    const user = useAuthStore().user;
    const { notifyError, notifySuccess, notifyInfo } = useNotify();
    const loading = ref(false);
    const imageFile = ref('');
    const body = ref({
      name: '',
      password: '',
      cpf_cnpj: '',
      cidade_id: 0,
      image: '',
      fone: '',
      whatsapp: '',
    });

    const handleUpload = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.multiple = false;
      document.body.appendChild(fileInput);
      fileInput.click();
      fileInput.addEventListener('change', () => {
        setTimeout(async () => {
          imageFile.value = URL.createObjectURL(fileInput.files[0]);

          const object = new FormData();
          object.append('content', fileInput.files[0]);

          try {
            loading.value = true;
            const data = await useApi('/upload/images').post(object);
            body.value.image = { ...data };
          } catch (error: any) {
            notifyError(error.message);
          } finally {
            loading.value = false;
            document.body.removeChild(fileInput);
          }
        });
      });
    };

    onMounted(() => {
      if (user) {
        imageFile.value = user.image && user.image.url ? user.image.url : '';

        body.value.name = user.name;
        body.value.password = '';
        body.value.cpf_cnpj = user.cpf_cnpj;
        body.value.cidade_id = user.cidade_id;
        body.value.fone = user.fone;
        body.value.whatsapp = user.whatsapp;
      }
    });

    const imageHeader = computed(() => {
      return user && user.image ? user.image.url : '';
    });

    const handleUserSave = async () => {
      try {
        loading.value = true;

        body.value.name = body.value.name.toUpperCase();

        if (user) {
          const data = await useApi<IUser>('/user').patch({
            id: user.id,
            body: body.value,
          });

          useAuthStore().updateUser(data);
        }

        notifySuccess('Registro atualizado.');
      } catch (error: any) {
        notifyError(error.message);
      } finally {
        loading.value = false;
      }
    };

    const handleLogout = () => {
      useAuthStore().logout();
      notifyInfo('Até breve... :)');
      router.push('/');
    };

    const showHeaderDetail = computed(() => {
      return user
        ? router.currentRoute.value.name
            ?.toString()
            .toLowerCase()
            .includes(removerAcentos(user.tipo).toLowerCase())
        : '';
    });

    return {
      tipo,
      imageFile,
      ShowUser: ref(false),
      user,
      body,
      loading,
      handleUserSave,
      handleUpload,
      imageHeader,
      handleLogout,
      showHeaderDetail,
    };
  },
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 320px
</style>
