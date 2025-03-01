import React from 'react';
import { Pencil, Trash } from 'lucide-react';

import { IAddress } from '@/types';
import FieldGroup from '@/helpers/FieldGroup';

import { Badge } from '@/components/ui/info/badge';
import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

type AddressItemProps = {
  address: IAddress;
};

const AddressItem: React.FC<AddressItemProps> = ({ address }) => {
  return (
    <li>
      <Card
        className={`relative ${address.isDefault ? 'border border-blue-500' : ''}`}
      >
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            Address
            {address.isDefault && <Badge variant="default">Default</Badge>}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Pencil size={16} />
            </Button>
            <Button variant="destructive" size="icon">
              <Trash size={16} />
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-2 gap-5">
          <FieldGroup title="Address Line 1" value={address.addressLine1} />
          {address.addressLine2 && (
            <FieldGroup title="Address Line 2" value={address.addressLine2} />
          )}
          <FieldGroup title="City" value={address.city} />
          <FieldGroup title="Country" value={address.country} />
          <FieldGroup title="State" value={address.state} />
          <FieldGroup title="Postal Code" value={address.postalCode} />
        </CardContent>
      </Card>
    </li>
  );
};

export default AddressItem;
