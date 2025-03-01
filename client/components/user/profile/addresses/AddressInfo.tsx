import React from 'react';

import FieldGroup from '@/helpers/FieldGroup';
import { IAddress } from '@/types';

type AddressInfo = {
  address: IAddress;
};

const AddressInfo: React.FC<AddressInfo> = ({ address }) => {
  return (
    <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
      <FieldGroup title="Address Line 1" value={address.addressLine1} />
      <FieldGroup
        title="Address Line 2"
        value={address.addressLine2 ?? 'Empty'}
      />
      <FieldGroup title="City" value={address.city} />
      <FieldGroup title="Country" value={address.country} />
      <FieldGroup title="State" value={address.state} />
      <FieldGroup title="Postal Code" value={address.postalCode} />
    </div>
  );
};

export default AddressInfo;
