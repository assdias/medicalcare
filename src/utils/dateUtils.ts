import { date } from 'quasar';
import dayjs from 'dayjs';

export function ISOtoDate(_date: string, _locale = 'pt-BR') {
  if (_date == undefined || !_date || _date == '') {
    return '';
  }

  const [d] = _date.split('T');
  const [year, month, day] = d.split('-');

  switch (_locale) {
    case 'pt-BR':
      return `${day}/${month}/${year}`;
    case 'en-US':
      return `${year}-${month}-${day}`;
  }
}

export function DateToISO(_date: Date) {
  return date.formatDate(_date, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
}

export function DateNow() {
  const newDate = DateToISO(Date.now());
  return ISOtoDate(newDate);
}

export function DateBrToUSFormat(_date: string) {
  const [day, month, year] = _date.split('/');
  return `${year}-${month}-${day}`;
}

export function dateToNativeDate(_date: Date): Date {
  const strDate = DateBrToUSFormat(String(_date));
  return dayjs(strDate).toDate();
}

export function isIsoDate(str): boolean {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d) && d.toISOString() === str; // valid date
}

// Substituir pelas opções acima

export function strToDate(date: string, delimiter = '/'): Date {
  const [day, month, year] = date.split(delimiter);
  return new Date(Number(year), Number(month), Number(day));
}

export function formatDate(aDate: Date): string {
  return date.formatDate(aDate, 'DD/MM/YYYY');
}

export function diaSemana(_date: Date): string {
  return date.formatDate(_date, 'dddd');
}

export function dateIsoToBr(dateValue: string, mask = 'YYYY-MM-DD'): string {
  const newDate = date.extractDate(dateValue, mask);
  const stringDate = date.formatDate(newDate, 'DD/MM/YYYY');

  if (stringDate == '01/01/1900') {
    return '';
  } else {
    return stringDate;
  }
}

export function dateBrToIso(dateValue: string, mask = 'DD/MM/YYYY'): string {
  const newDate = date.extractDate(dateValue, mask);
  const stringDate = date.formatDate(newDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

  if (stringDate == '1900-01-01T00:00:00.000-04:00') {
    return '';
  } else {
    return stringDate;
  }
}

/* deprecated */
export function newDate(_locale = 'pt-BR') {
  const newDate = new Intl.DateTimeFormat(_locale).format(Date.now());
  return newDate;
}
