'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Category } from '@/types';
import { CATEGORY_LIST } from '@/constants';
import { CreateProductSchema } from '@/lib/zod/product.zod';
import { getCategoryById } from '@/lib/utils';
import { useToast } from '@/hooks/core/use-toast';
import { validateObject } from '@/validations/validate-object';

import PickCategory from './PickCategory';
import Description from './Description';
import FormFieldRenderer from '../../../../../../helpers/FormFieldRenderer';
import Uploader from '@/components/shared/Uploader';

import { Separator } from '@/components/ui/layout/separator';
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
import { Button } from '@/components/ui/buttons/button';
import { useMutation } from '@tanstack/react-query';

import { createProduct } from '@/lib/actions/product.actions';

type ProductFormValues = z.infer<typeof CreateProductSchema>;

const HandleProductForm: React.FC = () => {
  const { toast } = useToast();

  const { mutateAsync: createProductMutation, status } = useMutation({
    mutationFn: (data: FormData) => createProduct(data),
    onSuccess: (response) => {
      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: (error as any)?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      stock: 0,
      discount: 0,
      category: 0,
      attributes: {},
      images: [],
    },
  });

  const isLoading = status === 'pending';
  const selectedCategoryId = form.watch('category');

  const selectedCategory = React.useMemo(
    () => getCategoryById(selectedCategoryId, CATEGORY_LIST),
    [selectedCategoryId],
  );

  useEffect(() => {
    if (selectedCategory) {
      const initialAttributes = selectedCategory.fields?.reduce(
        (acc, field) => {
          acc[field.name] = field.defaultValue || '';
          return acc;
        },
        {} as Record<string, any>,
      );

      form.setValue('attributes', initialAttributes || {});
    }
  }, [selectedCategory, form]);

  const handleCategorySelect = (category: Category) => {
    form.setValue('category', category.id);
  };

  const handleFormSubmit = async (data: ProductFormValues) => {
    const attributes = form.getValues('attributes') as Record<string, any>;
    let errors: string[] = [];

    if (selectedCategory?.fields && selectedCategory.fields.length > 0) {
      errors = validateObject(attributes, selectedCategory.fields);
    }

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
      });
      return;
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'images') {
        formData.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value),
        );
      }
    });

    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    await createProductMutation(formData);
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
          {selectedCategory?.fields && (
            <>
              <Separator />
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Product Attributes</h3>
                {selectedCategory.fields.map((field) => (
                  <FormFieldRenderer<ProductFormValues>
                    key={field.name}
                    control={form.control}
                    name={`attributes.${field.name}`}
                    fieldConfig={field}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="images"
            render={({ fieldState }) => (
              <FormItem>
                <FormControl>
                  <Uploader
                    name="images"
                    control={form.control}
                    label="Product Images"
                    dropzoneOptions={{ multiple: true }}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!form.formState.isValid}>
            {form.formState.isSubmitting && isLoading
              ? 'Submitting...'
              : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HandleProductForm;
