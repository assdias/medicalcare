import { useQuasar } from 'quasar';

export default function useNotify() {
  const $q = useQuasar();

  const notifySuccess = (message, caption = '') => {
    $q.notify({
      type: 'positive',
      //position: 'top-right',
      closeBtn: true,
      progress: true,
      caption: caption,
      message: message || 'Deu tudo certo :)',
    });
  };

  const notifyError = (message, caption = '') => {
    $q.notify({
      type: 'negative',
      //position: 'top-right',
      progress: true,
      caption: caption,
      message: message || 'Oops, algo deu errado :(',
    });
  };

  const notifyWarning = (message, caption = '') => {
    $q.notify({
      type: 'warning',
      //position: 'top-right',
      progress: true,
      caption: caption,
      message: message || 'Hum... fique atento :-X',
    });
  };

  const notifyInfo = (message, caption = '', spinner = false) => {
    $q.notify({
      type: 'info',
      closeBtn: true,
      spinner: spinner,
      progress: !spinner,
      //position: 'top-right',
      caption: caption,
      message: message || 'Fique por dentro ;)',
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
}
