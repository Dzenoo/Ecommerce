import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CouponMutationType,
  useCouponMutation,
} from '@/hooks/mutations/useCoupon.mutation';
import { ApplyCouponSchema } from '@/lib/zod/coupon.zod';
import { queryClient } from '@/context/react-query-client';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form/form';

type ApplyCouponProps = {
  cartId: string;
};

type ApplyCouponFormValues = z.infer<typeof ApplyCouponSchema>;

const ApplyCoupon: React.FC<ApplyCouponProps> = ({ cartId }) => {
  const form = useForm<ApplyCouponFormValues>({
    resolver: zodResolver(ApplyCouponSchema),
    defaultValues: {
      couponCode: '',
    },
  });

  const mutation = useCouponMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleApplyCoupon = (values: ApplyCouponFormValues) => {
    mutation.mutateAsync({
      type: CouponMutationType.APPLY,
      cartId,
      data: { couponCode: values.couponCode },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleApplyCoupon)}
        className="flex gap-2"
      >
        <FormField
          control={form.control}
          name="couponCode"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input {...field} placeholder="Coupon" type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline">
          Apply
        </Button>
      </form>
    </Form>
  );
};

export default ApplyCoupon;
