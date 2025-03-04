import { Truck } from 'lucide-react';

import { IAddress } from '@/types';
import AddressItem from './AddressItem';
import Empty from '@/helpers/Empty';

type AddressListProps = {
  addresses: IAddress[];
};

const AddressList: React.FC<AddressListProps> = ({ addresses }) => {
  if (addresses.length === 0)
    return (
      <Empty
        icon={<Truck size={25} className="mb-4" />}
        title="No Addresses Created"
        description="You can add addresses for easier checkouts."
      />
    );

  return (
    <ul className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
      {addresses.map((address) => (
        <AddressItem key={address._id} address={address} />
      ))}
    </ul>
  );
};

export default AddressList;
