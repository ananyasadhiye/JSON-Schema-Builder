export type FieldType = 'string' | 'number' | 'nested';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  fields?: Field[];
}
