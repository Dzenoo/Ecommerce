import { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';

import {
  AddressMutationType,
  useAddressMutation,
} from '@shared/hooks/mutations/useAddress.mutation';
import { IAddress } from '@shared/types';
import { queryClient } from '@shared/context/react-query-client';
import AddressInfo from './AddressInfo';
import AddressForm from './forms/AddressForm';

import { Badge } from '@shared/components/ui/info/badge';
import { Button } from '@shared/components/ui/buttons/button';
import { Separator } from '@shared/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/layout/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@shared/components/ui/layout/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/layout/dialog';

type AddressItemProps = {
  address: IAddress;
};

const AddressItem: React.FC<AddressItemProps> = ({ address }) => {
  const [editOpen, setEditOpen] = useState(false);
  const mutation = useAddressMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const handleDeleteAddress = () => {
    mutation.mutateAsync({
      type: AddressMutationType.DELETE,
      addressId: address._id,
    });
  };

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
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Pencil size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Address</DialogTitle>
                  <DialogDescription>
                    Please fill all required fields.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll p-2">
                  <AddressForm addressToEdit={address} onSuccess={() => setEditOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your address.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAddress}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <AddressInfo address={address} />
        </CardContent>
      </Card>
    </li>
  );
};

export default AddressItem;
