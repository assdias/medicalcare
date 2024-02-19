<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" persistent full-width @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-bar>
        <div>Localização</div>

        <q-space />

        <q-btn round dense flat icon="close" v-close-popup>
          <q-tooltip>Fechar</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <div class="mapouter">
          <div class="gmap_canvas">
            <iframe
              width="100%"
              height="100%"
              id="gmap_canvas"
              :src="urlMap"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </q-card-section>
      <q-card-section
        ><a
          :href="urlExtMap"
          target="_blank"
          class="tw-cursor-pointer tw-text-blue-500 hover:tw-text-blue-600 tw-underline-offset-2 visited:tw-text-blue-600"
          >{{ endereco }}</a
        ></q-card-section
      >
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar';
import { computed } from 'vue';

export default {
  name: 'LocalizacaoPrestadorDialog',

  props: {
    endereco: {
      type: String,
    },
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup(props) {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, /*onDialogOK,*/ onDialogCancel } =
      useDialogPluginComponent();

    const urlMap = computed(() => {
      return `https://maps.google.com/maps?q=${props.endereco}=&z=15&ie=UTF8&iwloc=&output=embed`;
    });

    const urlExtMap = computed(() => {
      return `https://maps.google.com/maps?q=${props.endereco}=&z=15&ie=UTF8`;
    });

    return {
      urlMap,
      urlExtMap,
      dialogRef,
      onDialogHide,

      onOKClick() {
        //return;
      },

      onCancelClick: onDialogCancel,
    };
  },
};
</script>

<style scoped>
.gmap_canvas {
  overflow: hidden;
  background: none !important;
  height: 360px;
  width: 100%;
}

.mapouter {
  position: relative;
  text-align: right;
  height: 360px;
  width: 100%;
}
</style>
