import { Heart, LayoutDashboard, ShoppingBag } from 'lucide-react';

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
];

export const AdminNavbarActions = [
  { id: 1, icon: LayoutDashboard, text: 'Dashboard', href: '/dashboard' },
];
