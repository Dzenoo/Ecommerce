'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import ProfileNavigation from '@/components/user/profile/ProfileNavigation';
import AccountDetails from '@/components/user/profile/details/AccountDetails';
import { UserQueryType, useUserQuery } from '@/hooks/queries/useUser.query';

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || '';

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
    <section className="grid grid-cols-[0.4fr,2fr] gap-5 pt-5">
      <div>
        <ProfileNavigation />
      </div>
      <div>
        {tab === '' && (
          <div>
            <AccountDetails user={data.user} />
          </div>
        )}
        {tab === 'orders' && <div>Orders</div>}
        {tab === 'reviews' && <div>Reviews</div>}
        {tab === 'addresses' && <div>Addresses</div>}
      </div>
    </section>
  );
};

export default ProfilePage;
