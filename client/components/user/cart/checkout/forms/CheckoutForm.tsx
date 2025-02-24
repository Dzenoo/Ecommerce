import React, { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { CreateOrderSchema } from '@/lib/zod/order.zod';
import { COUNTRIES } from '@/constants';
import {
  OrderMutationType,
  useOrderMutation,
} from '@/hooks/mutations/useOrder.mutation';
import {
  AddressQueryType,
  useAddressQuery,
} from '@/hooks/queries/useAddress.query';
import { useToast } from '@/hooks/core/use-toast';
import { queryClient } from '@/context/react-query-client';
import FieldGroup from '@/helpers/FieldGroup';
import { AddressType } from '../SelectAddress';

import { Input } from '@/components/ui/form/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';

export type CheckoutFormValues = z.infer<typeof CreateOrderSchema>;

type CheckoutFormProps = {
  cartId: string;
  type: AddressType;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartId, type }) => {
  const [selectedAddress, setSelectedAddress] = useState('');

  const { toast } = useToast();
  const router = useRouter();

  const { data } = useAddressQuery({
    type: AddressQueryType.GET_ADDRESSES,
    params: { query: {} },
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });

  const mutation = useOrderMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      form.reset();
      toast({
        title: 'Success',
        description: response.message,
      });

      setTimeout(() => {
        router.push('/');
      }, 1000);
    },
  });

  const handleCreateAutomaticOrder = (e: FormEvent) => {
    e.preventDefault();

    if (selectedAddress === '') {
      toast({
        title: 'Error',
        description: 'Please select one address',
      });
      return;
    }

    return mutation.mutateAsync({
      type: OrderMutationType.CREATE,
      data: {
        cartId,
        addressId: selectedAddress,
      },
    });
  };

  const handleCreateManualOrder = (values: CheckoutFormValues) => {
    return mutation.mutateAsync({
      type: OrderMutationType.CREATE,
      data: {
        cartId,
        address: values,
      },
    });
  };

  if (type === 'auto') {
    return (
      <div className="space-y-10 pt-5">
        <form
          id="checkout-form"
          onSubmit={handleCreateAutomaticOrder}
          className="w-full space-y-5"
        >
          {data?.addresses.map((a) => (
            <div
              onClick={() => setSelectedAddress(a._id)}
              className="cursor-pointer"
              key={a._id}
            >
              {a._id}
            </div>
          ))}
        </form>
      </div>
    );
  } else if (type === 'manual') {
    return (
      <div className="space-y-10 pt-5">
        <FieldGroup
          title="Shipping Address and Payment"
          value="Enter your shipping address and payment details"
          customStyles={{ h1: 'text-xl font-medium', p: 'text-sm' }}
        />
        <Form {...form}>
          <form
            id="checkout-form"
            onSubmit={form.handleSubmit(handleCreateManualOrder)}
            className="w-full space-y-5"
          >
            <div className="grid grid-cols-2 items-center gap-5">
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
            </div>
            <div className="grid grid-cols-2 items-center gap-5">
              <FormField
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map((country, i) => (
                          <SelectItem key={i} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select your country</FormDescription>
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
            </div>
            <div className="grid grid-cols-2 items-center gap-5">
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
            </div>
          </form>
        </Form>
      </div>
    );
  } else {
    return null;
  }
};

export default CheckoutForm;
