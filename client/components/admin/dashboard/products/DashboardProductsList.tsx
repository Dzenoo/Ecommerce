import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Delete, Edit, MoreHorizontal } from 'lucide-react';

import { getCategoryById } from '@/lib/utils';
import { IProduct } from '@/types';
import {
  ProductMutationType,
  useProductMutation,
} from '@/hooks/mutations/useProduct.mutation';
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

type DashboardProductsListProps = {
  productsData: { products: IProduct[]; totalProducts: number };
};

const DashboardProductsList: React.FC<DashboardProductsListProps> = ({
  productsData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const productMutation = useProductMutation();

  return (
    <Table>
      <TableCaption>A list of your products</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            '',
            'Id',
            'Name',
            'Description',
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
        {productsData.products.map((product) => (
          <TableRow className="whitespace-nowrap" key={product._id}>
            <TableCell>
              <Image
                src={product.images[0]}
                alt={product.name}
                width={50}
                height={50}
              />
            </TableCell>
            <TableCell>{product._id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell className="truncate">{product.description}</TableCell>
            <TableCell>{getCategoryById(product.category)?.name}</TableCell>
            <TableCell>{product.price} DIN</TableCell>
            <TableCell>{product.discount} %</TableCell>
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
                    <Link href={`/dashboard/products/${product._id}/add`}>
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
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={8}>Total</TableCell>
          <TableCell className="text-right">
            {productsData.totalProducts}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DashboardProductsList;
