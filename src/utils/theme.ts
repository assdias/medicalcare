const form = {
  autocorrect: 'off',
  autocapitalize: 'off',
  autocomplete: 'off',
  spellcheck: 'false',
};

const styleInput = {
  color: 'primary',
  filled: true,
  dense: false,
};

const styleBtn = {
  flat: true,
  dense: false,
  'no-caps': true,
};

const input = {
  ...styleInput,
  counter: false,
  clearable: true,
};

const inputUppercase = {
  ...input,
  class: 'text-uppercase',
};

const inputLowercase = {
  ...input,
  class: 'text-lowercase',
};

const inputCapitalize = {
  ...input,
  class: 'tw-capitalize',
};

const slider = {
  ...styleInput,
  color: 'positive',
  label: true,
  'label-always': true,
  class: 'q-mt-lg q-mb-sm',
};

const radio = {
  ...styleInput,
  'checked-icon': 'task_alt',
  'unchecked-icon': 'panorama_fish_eye',
};

const toggle = {
  ...styleInput,
  'keep-color': true,
  'checked-icon': 'check',
  'unchecked-icon': 'clear',
};

const select = {
  ...styleInput,
  'popup-content-class': 'border-custom',
};

const menu = {
  color: 'primary',
  dense: false,
  class: 'border-custom',
  anchor: 'bottom left',
  self: 'top left',
};

const myLocale = {
  /* starting with Sunday */
  days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
  months:
    'Janeiro_Fevereiro_Março_Abril_Maio_Junio_Julio_Agosto_Septembro_Outubro_Novembro_Dezembro'.split(
      '_'
    ),
  monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Diz'.split('_'),
  firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'dias',
};

const datePopup = {
  ...styleInput,
  bordered: true,
  'today-btn': true,
  minimal: true,
  color: 'primary',
  'text-color': 'white',
  mask: 'DD/MM/YYYY',
  locale: myLocale,
};

const card = {
  flat: true,
  bordered: true,
};

const expansionItemBase = {
  'default-opened': true,
  'expand-icon-toggle': true,
  'switch-toggle-side': true,
  'expand-icon-class': 'text-accent',
};

const expansionItem = {
  ...expansionItemBase,
  'header-class':
    'tw-font-semibold tw-border-t-4 tw-border-b-1 tw-border-primary',
};

const table = {
  ...styleInput,
  bordered: true,
};

const btn = {
  ...styleBtn,
  ripple: true,
};

const btnPrimary = {
  ...styleBtn,
  color: 'primary',
};

const btnSecondary = {
  ...styleBtn,
  color: 'secondary',
};

const btnInfo = {
  ...styleBtn,
  color: 'info',
};

const btnAccent = {
  ...styleBtn,
  color: 'accent',
};

const btnPositive = {
  ...styleBtn,
  color: 'positive',
};

const btnNegative = {
  ...styleBtn,
  color: 'negative',
};

const btnWarning = {
  ...styleBtn,
  color: 'warning',
};

const btnDark = {
  ...styleBtn,
  color: 'dark',
};

const btnLight = {
  ...styleBtn,
  color: 'light',
};

const chip = {
  ...styleBtn,
  'text-color': 'white',
};

const chipSecondary = {
  ...chip,
  color: 'secondary',
};

export {
  chip,
  chipSecondary,
  form,
  input,
  inputUppercase,
  inputLowercase,
  inputCapitalize,
  slider,
  radio,
  toggle,
  select,
  menu,
  datePopup,
  card,
  table,
  expansionItemBase,
  expansionItem,
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
};
