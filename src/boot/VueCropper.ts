import { boot } from 'quasar/wrappers';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.use(VueCropper);
});
