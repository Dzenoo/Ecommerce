import { Category } from '@/types';

export const CATEGORY_LIST: Category[] = [
  {
    id: 1,
    name: 'Clothing',
    href: '/clothing',
    fields: [],
    subcategories: [
      {
        id: 11,
        parentId: 1,
        name: 'Men',
        href: '/clothing/men',
        fields: [],
        subcategories: [
          {
            id: 111,
            parentId: 11,
            name: 'Shirts',
            href: '/clothing/men/shirts',
            fields: [
              {
                name: 'size',
                label: 'Shirt Size',
                type: 'select',
                required: true,
                options: ['S', 'M', 'L', 'XL'],
              },
              {
                name: 'material',
                label: 'Material',
                type: 'text',
                required: true,
              },
            ],
          },
          {
            id: 112,
            parentId: 11,
            name: 'Pants',
            href: '/clothing/men/pants',
            fields: [],
          },
        ],
      },
      {
        id: 12,
        parentId: 1,
        name: 'Women',
        href: '/clothing/women',
        fields: [],
        subcategories: [
          {
            id: 121,
            parentId: 12,
            name: 'Dresses',
            href: '/clothing/women/dresses',
            fields: [],
          },
          {
            id: 122,
            parentId: 12,
            name: 'Skirts',
            href: '/clothing/women/skirts',
            fields: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Shoes',
    href: '/shoes',
    fields: [],
    subcategories: [
      {
        id: 21,
        parentId: 2,
        name: 'Sneakers',
        href: '/shoes/sneakers',
        fields: [],
      },
      {
        id: 22,
        parentId: 2,
        name: 'Boots',
        href: '/shoes/boots',
        fields: [],
      },
    ],
  },
];
