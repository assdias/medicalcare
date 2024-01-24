import { format } from 'quasar';
const { pad } = format;

export function geraNumDocumento(prefixo = ''): string {
  const numero = Math.floor(Math.random() * 65536);
  const numStr = pad(numero.toString(), 6);
  return prefixo ? `${prefixo}-${numStr}` : numStr;
}

export function formatNumDocumento(
  numDoc: string,
  parc = 1,
  parcs = 1
): string {
  return `${numDoc.toLocaleUpperCase()}-${parc}/${parcs}`;
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

export function removerAcentos(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
