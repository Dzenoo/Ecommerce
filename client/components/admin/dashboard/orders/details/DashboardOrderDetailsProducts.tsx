import React from 'react';
import Image from 'next/image';

import { IOrder } from '@/types';
import FieldGroup from '@/helpers/FieldGroup';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/utilities/table';

type DashboardOrderDetailsProductsProps = {
  order: IOrder;
};

const DashboardOrderDetailsProducts: React.FC<
  DashboardOrderDetailsProductsProps
> = ({ order }) => {
  const tax = 400;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-semibold">Products</h1>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {['Product Name', 'Price', 'Quantity', 'Total'].map((header) => (
                <TableHead className="whitespace-nowrap" key={header}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow className="whitespace-nowrap" key={item._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      className="h-12 w-12 rounded-full object-cover"
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={50}
                      height={50}
                    />
                    <h1>{item.product.name}</h1>
                  </div>
                </TableCell>
                <TableCell className="max-sm:pl-5">
                  {item.product.price}$
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product.price * item.quantity}$</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-end justify-end gap-5 max-sm:items-start max-sm:justify-between">
        <div className="space-y-4 max-sm:w-full">
          <FieldGroup
            title="Subtotal:"
            value={`${order.totalPrice}$`}
            customStyles={{
              div: 'flex-row gap-40 items-center justify-between max-sm:gap-5',
            }}
          />
          <FieldGroup
            title="Tax(20%):"
            value={`${tax}$`}
            customStyles={{
              div: 'flex-row gap-40 items-center justify-between max-sm:gap-5',
            }}
          />
          <FieldGroup
            title="Total:"
            value={`${order.totalPrice + tax}$`}
            customStyles={{
              div: 'flex-row gap-40 items-center justify-between font-bold text-xl max-sm:gap-5',
            }}
          />
          <FieldGroup
            title="Status:"
            value={`${order.status}`}
            customStyles={{
              div: 'flex-row gap-40 items-center justify-between max-sm:gap-5',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOrderDetailsProducts;
