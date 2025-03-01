'use client';

import React from 'react';

import {
  AddressQueryType,
  useAddressQuery,
} from '@/hooks/queries/useAddress.query';
import AddressList from './AddressList';
import FieldGroup from '@/helpers/FieldGroup';
import AddressForm from './forms/AddressForm';
import LoadingAddresses from '@/components/shared/loading/user/LoadingAddresses';

import { Button } from '@/components/ui/buttons/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/layout/dialog';

const Addresses: React.FC = () => {
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
    <div className="space-y-10">
      <div className="max-md:items flex items-center justify-between gap-5 max-md:flex-col">
        <div className="overflow-hidden">
          <FieldGroup
            title={`Saved Addresses (${data.totalAddresses})`}
            value="Easily manage addresses so you can finish checkouts faster"
            customStyles={{
              h1: 'font-medium text-xl',
              p: 'text-sm',
            }}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="max-md:w-full">Add Address</Button>
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
      <div>
        <AddressList addresses={data.addresses} />
      </div>
    </div>
  );
};

export default Addresses;
