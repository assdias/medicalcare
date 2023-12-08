<template>
  <q-layout view="lHh Lpr lFf" class="tw-bg-gradient-to-r tw-from-primary  tw-via-teal-300 tw-to-secondary ">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',


  setup () {

    return {

    }
  }
});
</script>



