import { boot } from 'quasar/wrappers';
import {
  menu,
  home,
  person,
  fingerprint,
  password,
  visibility,
  visibilityOff,
  darkMode,
  logout,
  storage,
} from 'src/utils/themeIcons';

export default boot(({ app }) => {
  app.config.globalProperties.$iconMenu = menu;
  app.config.globalProperties.$iconHome = home;
  app.config.globalProperties.$iconPerson = person;
  app.config.globalProperties.$iconFingerprint = fingerprint;
  app.config.globalProperties.$iconPassword = password;
  app.config.globalProperties.$iconVisibility = visibility;
  app.config.globalProperties.$iconVisibilityOff = visibilityOff;
  app.config.globalProperties.$iconDarkMode = darkMode;
  app.config.globalProperties.$iconLogout = logout;
  app.config.globalProperties.$iconStorage = storage;
});
