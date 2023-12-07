import { boot } from 'quasar/wrappers';
import {
  form,
  input,
  inputUppercase,
  inputLowercase,
  inputCapitalize,
  slider,
  radio,
  toggle,
  select,
  datePopup,
  card,
  menu,
  expansionItem,
  expansionItemBase,
  btn,
  btnPrimary,
  btnSecondary,
  btnInfo,
  btnAccent,
  btnPositive,
  btnNegative,
  btnWarning,
  btnDark,
  btnLight,
  chip,
  chipSecondary,
  table,
} from 'src/utils/theme';

export default boot(({ app }) => {
  app.config.globalProperties.$themeForm = form;
  app.config.globalProperties.$themeInput = input;
  app.config.globalProperties.$themeInputUppercase = inputUppercase;
  app.config.globalProperties.$themeInputLowercase = inputLowercase;
  app.config.globalProperties.$themeInputCapitalize = inputCapitalize;
  app.config.globalProperties.$themeSlider = slider;
  app.config.globalProperties.$themeRadio = radio;
  app.config.globalProperties.$themeToggle = toggle;
  app.config.globalProperties.$themeSelect = select;
  app.config.globalProperties.$themeDatePopup = datePopup;
  app.config.globalProperties.$themeCard = card;
  app.config.globalProperties.$themeMenu = menu;
  app.config.globalProperties.$themeExpansionItemBase = expansionItemBase;
  app.config.globalProperties.$themeExpansionItem = expansionItem;

  app.config.globalProperties.$themeBtn = btn;
  app.config.globalProperties.$themeBtnPrimary = btnPrimary;
  app.config.globalProperties.$themeBtnSecondary = btnSecondary;
  app.config.globalProperties.$themeBtnInfo = btnInfo;
  app.config.globalProperties.$themeBtnAccent = btnAccent;
  app.config.globalProperties.$themeBtnPositive = btnPositive;
  app.config.globalProperties.$themeBtnNegative = btnNegative;
  app.config.globalProperties.$themeBtnWarning = btnWarning;
  app.config.globalProperties.$themeBtnDark = btnDark;
  app.config.globalProperties.$themeBtnLight = btnLight;

  app.config.globalProperties.$themeTable = table;

  app.config.globalProperties.$themeChip = chip;
  app.config.globalProperties.$themeChipSecondary = chipSecondary;
});
