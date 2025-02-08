import React from 'react';

import HandleProductForm from '../forms/handle-product/HandleProductForm';

import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

const AddProduct: React.FC = () => {
  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle>Add Product</CardTitle>
        <CardDescription>Add a new product to the store</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <HandleProductForm />
      </CardContent>
    </Card>
  );
};

export default AddProduct;
