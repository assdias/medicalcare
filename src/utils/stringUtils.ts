import { format } from 'quasar';
const { pad } = format;

export function geraNumDocumento(): string {
  const numero = Math.floor(Math.random() * 65536);
  return pad(numero.toString(), 6);
}

export function formatNumDocumento(
  numDoc: string,
  parc = 1,
  parcs = 1
): string {
  return `${numDoc.toLocaleUpperCase()}-${parc}/${parcs}`;
}
