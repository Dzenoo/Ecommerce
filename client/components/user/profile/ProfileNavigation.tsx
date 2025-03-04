'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/buttons/button';

const ProfileNavigation: React.FC = () => {
  const ProfileNavigationLinks = [
    {
      id: 1,
      title: 'Account Details',
      path: '/profile',
    },
    {
      id: 2,
      title: 'Order History',
      path: '/profile/orders',
    },
    {
      id: 3,
      title: 'Product Reviews',
      path: '/profile/reviews',
    },
    {
      id: 4,
      title: 'Delivery Addresses',
      path: '/profile/addresses',
    },
  ];

  return (
    <nav className="hide-scrollbar flex flex-col space-y-2 max-lg:flex-row max-lg:space-y-0 max-lg:overflow-x-auto">
      {ProfileNavigationLinks.map((link) => (
        <Button
          key={link.id}
          variant="ghost"
          className="items-start justify-start"
          asChild
        >
          <Link href={link.path}>{link.title}</Link>
        </Button>
      ))}
    </nav>
  );
};

export default ProfileNavigation;
