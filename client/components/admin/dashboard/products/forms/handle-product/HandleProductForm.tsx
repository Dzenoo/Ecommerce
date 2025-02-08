'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Category } from '@/types';
import { CATEGORY_LIST } from '@/constants';
import { CreateProductSchema } from '@/lib/zod/product.zod';

import PickCategory from './PickCategory';
import Description from './Description';

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

type HandleProductFormProps = {};

const HandleProductForm: React.FC<HandleProductFormProps> = () => {
  const form = useForm<z.infer<typeof CreateProductSchema>>({
    mode: 'onChange',
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      stock: 0,
      discount: 0,
      category: 0,
      attributes: {},
    },
  });

  const handleCategorySelect = (category: Category) => {
    form.setValue('category', category.id);
  };

  const handleFormSubmit = (data: z.infer<typeof CreateProductSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-2 gap-10"
      >
        <div className="space-y-10">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Type your product name" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter the name of product, minimum 2 characters,
                  maximum 25
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={() => (
              <FormItem>
                <FormLabel>Write a detailed description</FormLabel>
                <FormControl>
                  <Description form={form} />
                </FormControl>
                <FormDescription>
                  Provide a comprehensive description about product between 10
                  and 1000 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter starting price of product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    You can add stock quantity of product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add potential discount for this product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="category"
            render={() => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <PickCategory
                    categories={CATEGORY_LIST}
                    selectedCategory={form.getValues('category')}
                    onSelect={handleCategorySelect}
                  />
                </FormControl>
                <FormDescription>
                  Select a category for this product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div></div>
      </form>
    </Form>
  );
};

export default HandleProductForm;
