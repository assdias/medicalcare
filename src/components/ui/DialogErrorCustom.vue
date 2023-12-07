<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h5 text-red tw-font-semibold">{{
        title ? title : 'o͝ops!'
      }}</q-card-section>
      <q-card-section class="text-subtitle2"
        ><p v-html="message"></p
      ></q-card-section>
      <q-card-section>
        <q-expansion-item
          class="overflow-hidden border-custom"
          dense-toggle
          expand-separator
          label="Erros"
          expand-icon="o_error_outline"
          expanded-icon="o_error"
          switch-toggle-side
          caption="para mais informações clique aqui"
          style="border-radius: 5px"
        >
          <q-card>
            <q-card-section>
              <q-scroll-area style="height: 150px">
                <p>{{ details }}</p>
              </q-scroll-area>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          v-bind="{ ...$themeBtn }"
          icon="o_close"
          label="Fechar"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';

export default {
  name: 'DialogErrorCustom',

  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
    },
    details: {
      type: String,
    },
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup() {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK();
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },
    };
  },
};
</script>
