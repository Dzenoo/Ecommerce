import {
  Heart,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Settings,
  User,
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
  { id: 1, icon: LayoutDashboard, text: 'Dashboard', href: '/dashboard' },
  { id: 2, icon: ShoppingBag, text: 'Products', href: '/dashboard/products' },
  { id: 3, icon: ClipboardList, text: 'Orders', href: '/dashboard/orders' },
  {
    id: 4,
    icon: Settings,
    text: 'Settings',
    href: '/dashboard/settings',
  },
];
