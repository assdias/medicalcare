/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFilter, FilterType, Operator, Condition } from 'src/interfaces';
import { useAppStore } from 'src/stores/app';
import md5 from 'md5';
import { DateBrToUSFormat } from 'src/utils/dateUtils';

export function getKeyFilterStorege(sufixo: string) {
  const appStore = useAppStore();
  return md5(`${appStore.user.id}-${sufixo}`);
}

export async function getStoregeFilters(key: string): Promise<Array<IFilter>> {
  const appStore = useAppStore();
  let filters: Array<IFilter> = [];

  filters = [];
  const config = await appStore.loadConfigUserItem(key);

  if (config && config.filters.length > 0) {
    filters = config.filters;
  }

  return filters;
}

export async function setStoregeFilters(
  key: string,
  routePath: string,
  filters: Array<IFilter>
) {
  const appStore = useAppStore();
  if (filters.length > 0) {
    await appStore.saveConfigUserItem(key, routePath, {
      filters: filters,
    });
  } else {
    appStore.removeConfigUserItem(key);
  }
}

export async function getFilters(filters: Array<IFilter>) {
  if (!filters || filters.length == 0) return {};

  const _And = [];
  const _Or = [];
  const _Not = [];

  await filters.forEach(function (item: IFilter) {
    let where = {};

    if (!item.condition) throw new Error('E_INVALID_FILTER_CONDITION');
    if (!item.operator) throw new Error('E_INVALID_FILTER_OPERATOR');

    if (item.type == FilterType.DATE) {
      if (item.condition == Condition.BETWEEN) {
        where = {
          [item.field]: {
            gte: new Date(DateBrToUSFormat(item.value)),
            lte: new Date(DateBrToUSFormat(item.value2)),
          },
        };
      } else {
        where = {
          [item.field]: {
            [item.condition]: new Date(DateBrToUSFormat(item.value)),
          },
        };
      }
    } else if (item.type == FilterType.TEXT) {
      where = {
        [item.field]: {
          [item.condition]: item.value,
          mode: 'insensitive',
        },
      };
    } else {
      where = {
        [item.field]: {
          [item.condition]: item.value,
        },
      };
    }

    if (item.operator == Operator.AND) {
      _And.push(where);
    } else if (item.operator == Operator.OR) {
      _Or.push(where);
    } else if (item.operator == Operator.NOT) {
      _Not.push(where);
    }
  });

  const _where = {
    ...whereByOperator(Operator.AND, _And),
    ...whereByOperator(Operator.OR, _Or),
    ...whereByOperator(Operator.NOT, _Not),
  };

  return _where;
}

function whereByOperator(operador: Operator, condicao: any) {
  if (condicao.length > 0) {
    switch (operador) {
      case 'AND':
        return { AND: condicao };
      case 'OR':
        return { OR: condicao };
      case 'NOT':
        return { NOT: condicao };
    }
  } else {
    return {};
  }
}

export function getOptionsFilter(type: FilterType): [] {
  if (type === FilterType.DATE) {
    return [
      { label: 'Igual a', value: Condition.EQUALS },
      { label: 'Diferente de', value: Condition.NOT },
      { label: 'Maior ou igual a', value: Condition.GTE },
      { label: 'Menor ou igual a', value: Condition.LTE },
      { label: 'Entre', value: Condition.BETWEEN },
    ];
  } else {
    return [
      { label: 'Igual a', value: Condition.EQUALS },
      { label: 'Diferente de', value: Condition.NOT },
      { label: 'Maior ou igual a', value: Condition.GTE },
      { label: 'Menor ou igual a', value: Condition.LTE },
      { label: 'Contém', value: Condition.CONTAINS },
    ];
  }
}
