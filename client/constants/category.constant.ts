import { Category } from '@/types';

export const CATEGORY_LIST: Category[] = [
  {
    id: 1,
    name: 'Clothing',
    href: '/clothing',
    subcategories: [
      {
        id: 1,
        name: 'Men',
        href: '/clothing/men',
        subcategories: [
          { id: 11, name: 'Shirts', href: '/clothing/men/shirts' },
          { id: 12, name: 'Pants', href: '/clothing/men/pants' },
        ],
      },
      {
        id: 2,
        name: 'Women',
        href: '/clothing/women',
        subcategories: [
          { id: 21, name: 'Dresses', href: '/clothing/women/dresses' },
          { id: 22, name: 'Skirts', href: '/clothing/women/skirts' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Shoes',
    href: '/shoes',
    subcategories: [
      {
        id: 3,
        name: 'Sneakers',
        href: '/shoes/sneakers',
      },
      {
        id: 4,
        name: 'Boots',
        href: '/shoes/boots',
      },
    ],
  },
];
