'use client';

import React from 'react';

import { UserQueryType, useUserQuery } from '@/hooks/queries/useUser.query';
import FieldGroup from '@/helpers/FieldGroup';
import NotFound from '@/components/shared/NotFound';
import LoadingAccountDetails from '@/components/shared/loading/user/LoadingAccountDetails';

import { Card, CardContent } from '@/components/ui/layout/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/info/avatar';

const AccountDetails: React.FC = () => {
  const { data, isLoading } = useUserQuery({
    type: UserQueryType.GET_PROFILE,
  });

  if (isLoading) {
    return <LoadingAccountDetails />;
  }

  if (!data) {
    return (
      <div className="pt-5">
        <NotFound />
      </div>
    );
  }

  const user = data.user;

  return (
    <Card className="shadow-none">
      <CardContent className="flex justify-between">
        <div className="flex items-center gap-5">
          <Avatar className="h-36 w-36 rounded-full">
            <AvatarImage src="/images/avatar.jpg" alt="Avatar" />
            <AvatarFallback className="rounded-full">CN</AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <FieldGroup
              title="Name"
              value={user.first_name + ` ${user.last_name}`}
            />
            <FieldGroup title="Email" value={user.email} />
          </div>
        </div>
        <div className="flex space-x-5">
          <FieldGroup title="Total Orders" value={user.orders.length} />
          <FieldGroup title="Total Reviews" value={user.reviews.length} />
          <FieldGroup title="Total Addresses" value={user.addresses.length} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetails;
