import React from 'react';

import { IAddress } from '@/types';
import AddressList from './AddressList';
import FieldGroup from '@/helpers/FieldGroup';
import AddressForm from './forms/AddressForm';

import { Button } from '@/components/ui/buttons/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/layout/dialog';

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
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Address</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Please fill all required fields.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-96 overflow-y-scroll p-2">
                <AddressForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <AddressList addresses={data.addresses} />
      </div>
    </div>
  );
};

export default Addresses;
