export enum Role {
  User = 'user',
  Admin = 'admin',
}

export type FieldType = 'text' | 'number' | 'select' | 'checkbox';

export type CategoryField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
};

export type Category = {
  id: number;
  parentId?: number;
  name: string;
  href: string;
  fields?: CategoryField[];
  subcategories?: Category[];
};
