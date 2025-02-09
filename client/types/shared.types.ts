export enum Role {
  User = 'user',
  Admin = 'admin',
}

export type FieldType = 'text' | 'select' | 'multi';

export type CategoryField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?:
    | string[]
    | {
        label: string;
        value: string;
      }[];
  defaultValue?: string | number;
  description?: string;
  placeholder?: string;
};

export type Category = {
  id: number;
  parentId?: number;
  name: string;
  href: string;
  fields?: CategoryField[];
  subcategories?: Category[];
};
