import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CouponMutationType,
  useCouponMutation,
} from '@shared/hooks/mutations/useCoupon.mutation';
import { ApplyCouponSchema } from '@shared/lib/zod/coupon.zod';
import { queryClient } from '@shared/context/react-query-client';
import Loader from '@shared/components/ui/info/loader';

import { Button } from '@shared/components/ui/buttons/button';
import { Input } from '@shared/components/ui/form/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@shared/components/ui/form/form';

type ApplyCouponProps = {
  cartId: string;
};

type ApplyCouponFormValues = z.infer<typeof ApplyCouponSchema>;

const ApplyCouponForm: React.FC<ApplyCouponProps> = ({ cartId }) => {
  const form = useForm<ApplyCouponFormValues>({
    resolver: zodResolver(ApplyCouponSchema),
    defaultValues: {
      couponCode: '',
    },
  });

  const mutation = useCouponMutation({
    onSuccess: () => {
      form.reset();
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
        <Button
          type="submit"
          variant="outline"
          disabled={mutation.status === 'pending'}
        >
          {mutation.status === 'pending' ? (
            <Loader type="ScaleLoader" height={15} />
          ) : (
            'Apply'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ApplyCouponForm;
