'use client';

import React from 'react';

import {
  AddressQueryType,
  useAddressQuery,
} from '@/hooks/queries/useAddress.query';
import Addresses from '@/components/user/profile/addresses/Addresses';
import LoadingAddresses from '@/components/shared/loading/user/LoadingAddresses';

const AddressesPage = () => {
  const { data, isLoading } = useAddressQuery({
    type: AddressQueryType.GET_ADDRESSES,
    params: { query: {} },
  });

  if (isLoading) {
    return <LoadingAddresses />;
  }

  if (!data) {
    return;
  }

  return (
    <section>
      <Addresses data={data} />
    </section>
  );
};

export default AddressesPage;
