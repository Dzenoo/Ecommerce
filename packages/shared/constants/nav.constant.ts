import {
  Heart,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  User,
  TicketCheck,
  Plus,
  View,
} from "lucide-react";

export const UserNavbarActions = [
  {
    id: 1,
    icon: Heart,
    text: "Wishlist",
    href: "/wishlist",
  },
  {
    id: 2,
    icon: ShoppingBag,
    text: "Cart",
    href: "/cart",
  },
  {
    id: 3,
    icon: User,
    text: "Profile",
    href: "/profile",
  },
];

export const AdminNavbarActions = [
  {
    id: 1,
    icon: LayoutDashboard,
    text: "Dashboard",
    href: "/dashboard",
    subActions: [],
  },
  {
    id: 2,
    icon: ShoppingBag,
    text: "Products",
    href: "/dashboard/products",
    subActions: [
      {
        id: 2.1,
        icon: Plus,
        text: "Add Product",
        href: "/dashboard/products/add",
      },
      {
        id: 2.2,
        icon: View,
        text: "View Products",
        href: "/dashboard/products",
      },
    ],
  },
  {
    id: 3,
    icon: ClipboardList,
    text: "Orders",
    href: "/dashboard/orders",
    subActions: [],
  },
];
