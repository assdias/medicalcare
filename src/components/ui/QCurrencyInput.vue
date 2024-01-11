<template>
  <q-input
    ref="inputRef"
    v-bind="{ ...$themeInput }"
    :error-message="errorMessage"
    :error="!!errorMessage"
    v-model="formattedValue"
    :label="label"
  />
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input';
import { computed, watch } from 'vue';

const optionsDefault = {
  locale: 'pt-BR',
  currency: 'BRL',
  currencyDisplay: 'symbol',
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: true,
  hideNegligibleDecimalDigitsOnFocus: false,
  autoDecimalDigits: true,
  useGrouping: true,
  accountingSign: false,
};

export default {
  name: 'QCurrencyInput',
  props: {
    modelValue: Number,
    label: {
      type: String,
    },
    options: {
      type: Object,
      default: optionsDefault,
    },
    minValue: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  setup(props) {
    const { inputRef, formattedValue, numberValue, setValue, setOptions } =
      useCurrencyInput(props.options);

    const errorMessage = computed(() =>
      numberValue.value < props.minValue
        ? `O valor deve ser maior que ${props.minValue}`
        : undefined
    );

    watch(
      () => props.modelValue,
      (value) => {
        setValue(value);
      }
    );

    watch(
      () => props.currency,
      (currency) => {
        setOptions({ currency });
      }
    );

    return { inputRef, formattedValue, errorMessage };
  },
};
</script>
