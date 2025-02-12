import React from 'react';

import { IProduct } from '@/types';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/utilities/table';
import { getCategoryById } from '@/lib/utils';

type DashboardProductsListProps = {
  products: IProduct[];
};

const DashboardProductsList: React.FC<DashboardProductsListProps> = ({
  products,
}) => {
  const headers = [
    'Id',
    'Name',
    'Description',
    'Category',
    'Price',
    'Discount',
    'Stock',
  ];

  return (
    <Table>
      <TableCaption>A list of your products</TableCaption>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell>{product._id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell className="truncate">{product.description}</TableCell>
            <TableCell>{getCategoryById(product.category)?.name}</TableCell>
            <TableCell>{product.price} DIN</TableCell>
            <TableCell>%{product.discount}</TableCell>
            <TableCell>{product.stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DashboardProductsList;
