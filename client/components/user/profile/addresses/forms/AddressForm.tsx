import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  AddressMutationType,
  useAddressMutation,
} from '@/hooks/mutations/useAddress.mutation';
import { CreateAddressDto, IAddress } from '@/types';
import {
  CreateAddressSchema,
  UpdateAddressSchema,
} from '@/lib/zod/address.zod';
import { useToast } from '@/hooks/core/use-toast';
import { queryClient } from '@/context/react-query-client';
import { COUNTRIES } from '@/constants';
import Loader from '@/components/ui/info/loader';

import { Input } from '@/components/ui/form/input';
import { Button } from '@/components/ui/buttons/button';
import { Checkbox } from '@/components/ui/buttons/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/form';
import { SelectWrapper } from '@/components/ui/form/select';

type AddressFormProps = {
  addressToEdit?: IAddress | null;
};

const AddressForm: React.FC<AddressFormProps> = ({ addressToEdit = null }) => {
  const { toast } = useToast();
  const isEditing = !!addressToEdit;

  const Schema = isEditing ? CreateAddressSchema : UpdateAddressSchema;
  type FormValues = z.infer<typeof Schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      addressLine1: addressToEdit?.addressLine1 || '',
      addressLine2: addressToEdit?.addressLine2 || '',
      city: addressToEdit?.city || '',
      country: addressToEdit?.country || '',
      postalCode: addressToEdit?.postalCode || '',
      state: addressToEdit?.state || '',
      isDefault: addressToEdit?.isDefault || false,
    },
  });

  const mutation = useAddressMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });

      if (!isEditing) {
        form.reset();
      }

      toast({
        title: 'Success',
        description: response.message,
      });
    },
  });

  const isLoading = mutation.status === 'pending';

  const handleCreateAddress = async (values: FormValues) => {
    if (isEditing && addressToEdit) {
      mutation.mutateAsync({
        type: AddressMutationType.UPDATE,
        addressId: addressToEdit?._id,
        data: { ...values },
      });
    } else {
      mutation.mutateAsync({
        type: AddressMutationType.CREATE,
        data: { ...(values as CreateAddressDto) },
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(handleCreateAddress)}
      >
        <FormField
          name="addressLine1"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1 *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Street address, P.O. box, company name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="addressLine2"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                (Optional) Street address, P.O. box, company name, c/o
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter your city</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="country"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country *</FormLabel>
              <SelectWrapper
                className="w-full"
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a country"
                groups={[
                  {
                    options: COUNTRIES.map((c) => ({
                      label: c.name,
                      value: c.name,
                    })),
                  },
                ]}
              />
              <FormDescription>Select your country</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="state"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>State / Province</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="postalCode"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the postal code of the city
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            name="isDefault"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is Default</FormLabel>
                  <FormDescription>
                    (Optional) Set this address as default
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          disabled={isLoading || !form.formState.isValid}
          className="w-full"
        >
          {isLoading ? <Loader type="ScaleLoader" height={10} /> : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};

export default AddressForm;
