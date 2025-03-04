'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';

import { CreateCouponDto, ICoupon } from '@/types';
import { useToast } from '@/hooks/core/use-toast';
import { CreateCouponSchema, UpdateCouponSchema } from '@/lib/zod/coupon.zod';
import {
  CouponMutationType,
  useCouponMutation,
} from '@/hooks/mutations/useCoupon.mutation';
import { queryClient } from '@/context/react-query-client';
import { cn, formatDate } from '@/lib/utils';

import Loader from '@/components/ui/info/loader';

import { Calendar } from '@/components/ui/utilities/calendar';
import { Button } from '@/components/ui/buttons/button';
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
import { SelectWrapper } from '@/components/ui/form/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/layout/popover';

type HandleCouponFormProps =
  | {
      isEdit?: true;
      coupon: ICoupon;
    }
  | { isEdit?: false; coupon: undefined };

const HandleCouponForm: React.FC<HandleCouponFormProps> = (props) => {
  const { toast } = useToast();
  const router = useRouter();

  const schema = props.isEdit ? UpdateCouponSchema : CreateCouponSchema;
  type CouponFormValues = z.infer<typeof schema>;

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      discountType: 'fixed',
      discountValue: 0,
      maxUsage: 0,
      expirationDate: new Date(),
      minPurchaseAmount: 0,
    },
  });

  const couponMutation = useCouponMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });

      form.reset();

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/coupons');
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  const isLoading = couponMutation.status === 'pending';

  useEffect(() => {
    if (props.isEdit && props.coupon) {
      form.reset({
        ...props.coupon,
      });
    }
  }, [props.coupon, props.isEdit, form]);

  const handleFormSubmit = async (data: CouponFormValues) => {
    if (props.isEdit) {
      const updatePayload: Partial<CreateCouponDto> = {
        ...data,
      };

      return await couponMutation.mutateAsync({
        type: CouponMutationType.UPDATE,
        data: updatePayload,
        couponId: props.coupon._id,
      });
    } else {
      const createPayload: CreateCouponDto = {
        ...data,
        code: data.code!,
        discountType: data.discountType!,
        discountValue: data.discountValue!,
        expirationDate: data.expirationDate!,
      };

      return await couponMutation.mutateAsync({
        type: CouponMutationType.CREATE,
        data: createPayload,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="space-y-10">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type your code for this coupon"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter the code for this coupon. This will be used to
                  identify the coupon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <FormControl>
                  <SelectWrapper
                    className="w-full"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a discount type"
                    groups={[
                      {
                        options: [
                          {
                            label: 'percentage',
                            value: 'Percentage',
                          },
                          {
                            label: 'fixed',
                            value: 'Fixed',
                          },
                        ],
                      },
                    ]}
                  />
                </FormControl>
                <FormDescription>
                  Please select the discount type for this coupon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter discount value"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Please enter the discount value for this coupon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Expiration Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Please select the expiration date for this coupon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Usage (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Max usage limit. Default is 1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter the maximum number of times this coupon can be
                  used. Default is 1 (once).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minPurchaseAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Purchase (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Min purchase amount. Default is 0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter the minimum purchase amount for this coupon.
                  Default is 0 (no minimum).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="pt-5">
          <Button type="submit" disabled={!form.formState.isValid}>
            {form.formState.isSubmitting && isLoading ? (
              <Loader type="ScaleLoader" height={20} />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HandleCouponForm;
