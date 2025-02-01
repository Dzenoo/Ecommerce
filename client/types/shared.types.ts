export enum Role {
  User = 'user',
  Admin = 'admin',
}

export type Category = {
  id: number;
  name: string;
  href: string;
  subcategories?: Category[];
};
