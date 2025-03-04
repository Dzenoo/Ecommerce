import React, { useState } from 'react';
import Link from 'next/link';
import { Delete, Edit, MoreHorizontal } from 'lucide-react';

import { formatDate } from '@/lib/utils';
import { ICoupon } from '@/types';
import {
  useCouponMutation,
  CouponMutationType,
} from '@/hooks/mutations/useCoupon.mutation';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';

import Loader from '@/components/ui/info/loader';

import { Button } from '@/components/ui/buttons/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/utilities/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/layout/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/layout/dialog';

type DashboardCouponsListProps = {
  couponsData: { coupons: ICoupon[]; totalCoupons: number };
};

const DashboardCouponsList: React.FC<DashboardCouponsListProps> = ({
  couponsData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const couponMutation = useCouponMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });

      setIsDialogOpen(false);

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <Table>
      <TableCaption>A list of your coupons</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            'Id',
            'Code',
            'Discount Type',
            'Discount Value',
            'Expiry Date',
            'Max Usage',
            'Usage Count',
            'Min Purchase Amount',
            'Actions',
          ].map((header) => (
            <TableHead className="whitespace-nowrap" key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {couponsData.coupons.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8}>No coupons found</TableCell>
          </TableRow>
        ) : (
          couponsData.coupons.map((coupon) => (
            <TableRow className="whitespace-nowrap" key={coupon._id}>
              <TableCell>{coupon._id}</TableCell>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.discountType}</TableCell>
              <TableCell>
                {coupon.discountValue}
                {coupon.discountType === 'fixed' ? 'DIN' : '%'}
              </TableCell>
              <TableCell>{formatDate(coupon.expirationDate)}</TableCell>
              <TableCell>{coupon.maxUsage}</TableCell>
              <TableCell>{coupon.usageCount}</TableCell>
              <TableCell>{coupon.minPurchaseAmount}</TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/coupons/${coupon._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit />
                          Edit Coupon
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                        <Delete />
                        Delete Coupon
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Coupon</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure you want to
                        permanently delete this coupon?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={couponMutation.status === 'pending'}
                        onClick={() =>
                          couponMutation.mutate({
                            type: CouponMutationType.DELETE,
                            couponId: coupon._id,
                          })
                        }
                      >
                        {couponMutation.status === 'pending' ? (
                          <Loader type="ScaleLoader" height={20} />
                        ) : (
                          'Confirm'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={10}>Total</TableCell>
          <TableCell className="text-right">
            {couponsData.totalCoupons}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DashboardCouponsList;
