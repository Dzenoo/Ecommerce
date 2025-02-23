import React from 'react';
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
import Loader from '@/components/ui/info/loader';
import { useToast } from '@/hooks/core/use-toast';
import { queryClient } from '@/context/react-query-client';

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
import { Button } from '@/components/ui/buttons/button';

export type CheckoutFormValues = z.infer<typeof CreateOrderSchema>;

type CheckoutFormProps = {
  cartId: string;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartId }) => {
  const { toast } = useToast();
  const router = useRouter();

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

  const handleCreateOrder = (values: CheckoutFormValues) => {
    return mutation.mutateAsync({
      type: OrderMutationType.CREATE,
      data: {
        cartId,
        address: values,
      },
    });
  };

  const isLoading = mutation.status === 'pending';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateOrder)}
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
        <div className="pt-5">
          <Button
            className="w-full"
            type="submit"
            disabled={!form.formState.isValid}
          >
            {isLoading ? (
              <Loader type="ScaleLoader" height={10} />
            ) : (
              'Create Order'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
