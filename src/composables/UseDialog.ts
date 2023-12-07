import { useQuasar } from 'quasar';
import DialogErrorCustom from 'src/components/ui/DialogErrorCustom.vue';

export default function useDialog() {
  const $q = useQuasar();

  const dialogError = (message = '', detail = '', title = '') => {
    $q.dialog({
      component: DialogErrorCustom,
      componentProps: {
        title: title,
        message: message,
        details: detail,
        ///((detail) && (detail.name ) && (detail.name === 'AxiosError')) ? detail.config : detail
      },
    }).onOk(() => {
      // Enviar o erro para um repositorio
    });
  };

  const dialogAlert = (message: string) => {
    $q.dialog({
      title: 'Atenção',
      message: message,
    })
      .onOk(() => {
        // console.log('OK')
      })
      .onCancel(() => {
        // console.log('Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  };

  return {
    dialogError,
    dialogAlert,
  };
}
