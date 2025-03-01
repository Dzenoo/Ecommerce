import React from 'react';
import Link from 'next/link';

import { IAddress } from '@/types';
import AddressList from './AddressList';
import FieldGroup from '@/helpers/FieldGroup';

import { Button } from '@/components/ui/buttons/button';

type AddressesProps = {
  data: {
    addresses: IAddress[];
    totalAddresses: number;
  };
};

const Addresses: React.FC<AddressesProps> = ({ data }) => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-5">
        <div>
          <FieldGroup
            title={`Saved Addresses (${data.totalAddresses})`}
            value="Easily manage addresses so you can finish checkouts faster"
            customStyles={{
              h1: 'font-medium text-xl',
              p: 'text-sm',
            }}
          />
        </div>
        <div>
          <Button asChild>
            <Link href="/profile/addresses/new">Add Address</Link>
          </Button>
        </div>
      </div>
      <div>
        <AddressList addresses={data.addresses} />
      </div>
    </div>
  );
};

export default Addresses;
