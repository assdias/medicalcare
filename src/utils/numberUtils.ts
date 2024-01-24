export function formatCurrency(val: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}

export function formatCurrencyUS(val: number) {
  return new Intl.NumberFormat('en-US', {
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

export function extractNumber(val: string) {
  return val.match(/\d+/g);
}
