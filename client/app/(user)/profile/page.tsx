'use client';

import React from 'react';

import { UserQueryType, useUserQuery } from '@/hooks/queries/useUser.query';
import AccountDetails from '@/components/user/profile/details/AccountDetails';
import NotFound from '@/components/shared/NotFound';
import LoadingAccountDetails from '@/components/shared/loading/user/LoadingAccountDetails';

const AccountDetailsPage = () => {
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

  return (
    <section>
      <AccountDetails user={data.user} />
    </section>
  );
};

export default AccountDetailsPage;
