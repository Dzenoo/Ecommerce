import React from 'react';

import { IAddress } from '@/types';
import AddressItem from './AddressItem';

type AddressListProps = {
  addresses: IAddress[];
};

const AddressList: React.FC<AddressListProps> = ({ addresses }) => {
  return (
    <ul className="grid grid-cols-2 gap-5">
      {addresses.map((address) => (
        <AddressItem key={address._id} address={address} />
      ))}
    </ul>
  );
};

export default AddressList;
