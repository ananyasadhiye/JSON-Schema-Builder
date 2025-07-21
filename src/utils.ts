import type { Field } from './types';

export const getDefaultValue = (type: string) => {
  if (type === 'string') return '';
  if (type === 'number') return 0;
  return {};
};

export const convertToJson = (fields: Field[]): any => {
  const result: any = {};
  fields.forEach((field) => {
    if (!field.name) return;
    result[field.name] =
      field.type === 'nested'
        ? convertToJson(field.fields || [])
        : getDefaultValue(field.type);
  });
  return result;
};
