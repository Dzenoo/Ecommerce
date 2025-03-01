'use client';

import React, { useCallback, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/buttons/button';

export type AddressType = 'auto' | 'manual' | '';

type SelectAddressProps = {
  children: (addressType: AddressType) => React.ReactNode;
};

const SelectAddress: React.FC<SelectAddressProps> = ({ children }) => {
  const [addressType, setAddressType] = useState<AddressType>('');

  return (
    <div>
      <div className="flex items-center justify-between gap-5 max-sm:flex-col">
        <SelectAddressButton
          type="auto"
          addressType={addressType}
          setAddressType={setAddressType}
        >
          Saved Addresses
        </SelectAddressButton>
        <SelectAddressButton
          type="manual"
          addressType={addressType}
          setAddressType={setAddressType}
        >
          Manual Address
        </SelectAddressButton>
      </div>
      <div>{children(addressType)}</div>
    </div>
  );
};

const SelectAddressButton: React.FC<{
  type: AddressType;
  addressType: AddressType;
  setAddressType: (type: AddressType) => void;
  children: React.ReactNode;
}> = ({ type, addressType, setAddressType, children }) => {
  const handleAddressTypeChange = useCallback(
    () => setAddressType(type),
    [type],
  );

  return (
    <Button
      variant="outline"
      className={cn(
        'w-full py-20 capitalize',
        addressType === type && 'border-blue-500',
      )}
      onClick={handleAddressTypeChange}
    >
      {children}
    </Button>
  );
};

export default SelectAddress;
