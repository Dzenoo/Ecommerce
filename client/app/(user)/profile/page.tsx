'use client';

import React from 'react';

import { UserQueryType, useUserQuery } from '@/hooks/queries/useUser.query';
import AccountDetails from '@/components/user/profile/details/AccountDetails';

const AccountDetailsPage = () => {
  const { data, isLoading } = useUserQuery({
    type: UserQueryType.GET_PROFILE,
  });

  if (isLoading) {
    return 'Loading';
  }

  if (!data) {
    return null;
  }

  return (
    <section>
      <AccountDetails user={data.user} />
    </section>
  );
};

export default AccountDetailsPage;
