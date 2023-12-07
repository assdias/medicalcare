import { date } from 'quasar';

export function formatDateTime(val: string, fmt = 'DD/MM/YYYY HH:mm') {
  return val ? date.formatDate(val, fmt) : '';
}

export function formatCurrency(val: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}

export function formatDecimal(val: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    currency: 'BRL',
  }).format(val);
}

export function formatCEP(val: string) {
  return val
    ? val
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
    : '';
}

export function formatCNPJ(val: string) {
  return val
    ? val.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1 $2 $3/$4-$5')
    : '';
}

export function formatCPF(val: string) {
  let mascara = '';
  if (val) {
    mascara = val.replace(/\D/g, '');
    mascara = val.replace(/(\d{3})(\d)/, '$1 $2');
    mascara = val.replace(/(\d{3})(\d)/, '$1 $2');
    mascara = val.replace(/(\d{3})(\d)/, '$1 $2');
  }

  return mascara;
}

export function formatFone(val: string) {
  return val
    ? val.replace(/\D+/g, '').replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    : '';
}

export function formatCel(val: string) {
  return val
    ? val.replace(/\D+/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    : '';
}
