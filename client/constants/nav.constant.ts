import {
  Heart,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Settings,
  User,
  TicketCheck,
  Plus,
  View,
  Home,
} from 'lucide-react';

export const UserNavbarActions = [
  {
    id: 1,
    icon: Heart,
    text: 'Wishlist',
    href: '/wishlist',
  },
  {
    id: 2,
    icon: ShoppingBag,
    text: 'Cart',
    href: '/cart',
  },
  {
    id: 3,
    icon: User,
    text: 'Profile',
    href: '/profile',
  },
];

export const AdminNavbarActions = [
  {
    id: 1,
    icon: Home,
    text: 'Home',
    href: '/',
    subActions: [],
  },
  {
    id: 2,
    icon: LayoutDashboard,
    text: 'Dashboard',
    href: '/dashboard',
    subActions: [],
  },
  {
    id: 3,
    icon: ShoppingBag,
    text: 'Products',
    href: '/dashboard/products',
    subActions: [
      {
        id: 3.1,
        icon: Plus,
        text: 'Add Product',
        href: '/dashboard/products/add',
      },
      {
        id: 3.2,
        icon: View,
        text: 'View Products',
        href: '/dashboard/products',
      },
    ],
  },
  {
    id: 4,
    icon: ClipboardList,
    text: 'Orders',
    href: '/dashboard/orders',
    subActions: [],
  },
  {
    id: 5,
    icon: TicketCheck,
    text: 'Coupons',
    href: '/dashboard/coupons',
    subActions: [
      {
        id: 5.1,
        icon: Plus,
        text: 'Create Coupon',
        href: '/dashboard/coupons/create',
      },
      {
        id: 5.2,
        icon: View,
        text: 'View Coupons',
        href: '/dashboard/coupons/view',
      },
    ],
  },
  {
    id: 6,
    icon: Settings,
    text: 'Settings',
    href: '/dashboard/settings',
    subActions: [],
  },
];
