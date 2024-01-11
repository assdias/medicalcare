import { date } from 'quasar';

export function dateToDateTimeUTCString(value: Date): string {
  const _date = new Date(
    `${value}T${date.formatDate(new Date(), 'HH:mm:ss.SSSZ')}`
  );

  return _date.toUTCString();
}

export function formatDateTimeBR(value: Date, fmt = 'DD/MM/YYYY HH:mm') {
  return value ? date.formatDate(value, fmt) : '';
}

export function formatDateBR(value: Date): string {
  return date.formatDate(value, 'DD/MM/YYYY');
}

export function formatDateTime(value: Date, fmt = 'YYYY-MM-DD hh:mm A') {
  return value ? date.formatDate(value, fmt) : '';
}

export function formatDate(value: Date): string {
  return date.formatDate(value, 'YYYY-MM-DD');
}
