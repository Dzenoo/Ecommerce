'use client';

import React from 'react';

import QueryParamController from '@/components/shared/QueryParamController';

import { Button } from '@/components/ui/buttons/button';

const ProfileNavigation: React.FC = () => {
  const ProfileNavigationLinks = [
    {
      id: 1,
      title: 'Account Details',
      path: '',
    },
    {
      id: 2,
      title: 'Order History',
      path: 'orders',
    },
    {
      id: 3,
      title: 'Product Reviews',
      path: 'reviews',
    },
    {
      id: 4,
      title: 'Delivery Addresses',
      path: 'addresses',
    },
  ];

  return (
    <nav className="flex flex-col space-y-2">
      {ProfileNavigationLinks.map((link) => (
        <QueryParamController<string>
          key={link.id}
          paramKey="tab"
          defaultValue=""
        >
          {({ onChange }) => (
            <Button
              variant="ghost"
              className="items-start justify-start"
              onClick={() => onChange(link.path)}
            >
              {link.title}
            </Button>
          )}
        </QueryParamController>
      ))}
    </nav>
  );
};

export default ProfileNavigation;
