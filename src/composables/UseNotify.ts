import { Notify } from 'quasar';

export default function useNotify() {
  const notifySuccess = (message: string, caption = '') => {
    Notify.create({
      type: 'positive',
      //position: 'top-right',
      closeBtn: true,
      progress: true,
      caption: caption,
      message: message || 'Deu tudo certo :)',
    });
  };

  const notifyError = (message, caption = '') => {
    Notify.create({
      type: 'negative',
      //position: 'top-right',
      progress: true,
      caption: caption,
      message: message || 'Oops, algo deu errado :(',
    });
  };

  const notifyWarning = (message, caption = '') => {
    Notify.create({
      type: 'warning',
      //position: 'top-right',
      progress: true,
      caption: caption,
      message: message || 'Hum... fique atento :-X',
    });
  };

  const notifyInfo = (message, caption = '', spinner = false) => {
    Notify.create({
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
