/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectType } from 'src/interfaces';

export function getObjectFromArrayByProperty(
  array: Array<ObjectType | any>,
  property: string,
  keyValue: string
) {
  return array.find(function (item: any) {
    if (item.hasOwnProperty(property)) {
      return item[property] === keyValue;
    } else {
      return {};
    }
  });
}

export function arrayRemoveToObject(
  array: Array<ObjectType | any>,
  item: object
) {
  return array.filter(function (obj: object) {
    return obj != item;
  });
}

export function removeObjectToArrayByProperty(
  array: Array<ObjectType | any>,
  property: string,
  keyValue: string
) {
  const object = getObjectFromArrayByProperty(array, property, keyValue);

  if (object) {
    return arrayRemoveToObject(array, object);
  } else {
    return {};
  }
}
