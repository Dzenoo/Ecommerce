import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Delete, Edit, MoreHorizontal } from 'lucide-react';

import { getCategory } from '@shared/lib/utils';
import { formatPrice } from '@shared/lib/utils/currency.utils';
import { IProduct } from '@shared/types';
import {
  ProductMutationType,
  useProductMutation,
} from '@shared/hooks/mutations/useProduct.mutation';
import { useToast } from '@shared/hooks/core/use-toast';
import { queryClient } from '@shared/context/react-query-client';

import Loader from '@shared/components/ui/info/loader';

import { Button } from '@shared/components/ui/buttons/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/utilities/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/components/ui/layout/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/layout/dialog';

type DashboardProductsListProps = {
  productsData: { products: IProduct[]; totalProducts: number };
};

const DashboardProductsList: React.FC<DashboardProductsListProps> = ({
  productsData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const productMutation = useProductMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });

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
      <TableCaption>A list of your products</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            '',
            'Id',
            'Name',
            'Category',
            'Price',
            'Discount',
            'Stock',
            'Actions',
          ].map((header) => (
            <TableHead className="whitespace-nowrap" key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {productsData.products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8}>No products found</TableCell>
          </TableRow>
        ) : (
          productsData.products.map((product) => (
            <TableRow className="whitespace-nowrap" key={product._id}>
              <TableCell>
                <Image
                  className="min-w-[50px]"
                  src={product.images[0]}
                  alt={product.name}
                  width={50}
                  height={50}
                />
              </TableCell>
              <TableCell>{product.productNumber}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{getCategory('id', product.category)?.name}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>{product.discount}%</TableCell>
              <TableCell>{product.stock}</TableCell>
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
                      <Link href={`/dashboard/products/${product._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit />
                          Edit Product
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                        <Delete />
                        Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Product</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure you want to
                        permanently delete this product from server?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={productMutation.status === 'pending'}
                        onClick={() =>
                          productMutation.mutate({
                            type: ProductMutationType.DELETE,
                            productId: product._id,
                          })
                        }
                      >
                        {productMutation.status === 'pending' ? (
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
          <TableCell colSpan={7}>Total</TableCell>
          <TableCell className="text-right">
            {productsData.totalProducts}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DashboardProductsList;
