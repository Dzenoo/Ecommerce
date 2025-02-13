'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Category, IProduct } from '@/types';
import { CATEGORY_LIST } from '@/constants';
import {
  CreateProductSchema,
  UpdateProductSchema,
} from '@/lib/zod/product.zod';
import { getCategoryById } from '@/lib/utils';
import { useToast } from '@/hooks/core/use-toast';
import { validateObject } from '@/validations/validate-object';
import {
  useProductMutation,
  ProductMutationType,
} from '@/hooks/mutations/useProduct.mutation';
import { queryClient } from '@/context/react-query-client';

import PickCategory from './PickCategory';
import Description from './Description';
import FormFieldRenderer from '../../../../../../helpers/FormFieldRenderer';
import Uploader from '@/components/shared/Uploader';
import Loader from '@/components/ui/info/loader';

import { Separator } from '@/components/ui/layout/separator';
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

type HandleProductFormProps =
  | {
      isEdit?: true;
      product: IProduct;
    }
  | { isEdit?: false; product: undefined };

const HandleProductForm: React.FC<HandleProductFormProps> = (props) => {
  const { toast } = useToast();
  const router = useRouter();

  const schema = props.isEdit ? UpdateProductSchema : CreateProductSchema;
  type ProductFormValues = z.infer<typeof schema>;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
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

  const productMutation = useProductMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });

      form.reset();

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/products');
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

  const isLoading = productMutation.status === 'pending';
  const selectedCategoryId = form.watch('category');

  const selectedCategory = React.useMemo(
    () => getCategoryById(selectedCategoryId as number, CATEGORY_LIST),
    [selectedCategoryId],
  );

  useEffect(() => {
    if (props.isEdit && props.product) {
      const initialValues = {
        ...props.product,
        attributes: props.product.attributes || {},
      };

      form.reset(initialValues);

      setTimeout(() => {
        Object.entries(initialValues.attributes).forEach(([key, value]) => {
          form.setValue(`attributes.${key}` as any, value);
        });
      }, 100);
    }
  }, [props.product, props.isEdit, form]);

  useEffect(() => {
    if (selectedCategory && !props.isEdit) {
      const initialAttributes = selectedCategory.fields?.reduce(
        (acc, field) => {
          acc[field.name] = field.defaultValue || '';
          return acc;
        },
        {} as Record<string, any>,
      );

      form.setValue('attributes', initialAttributes || {});
    }
  }, [selectedCategory, form, props.isEdit]);

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

    if (props.isEdit) {
      return await productMutation.mutateAsync({
        type: ProductMutationType.UPDATE,
        data: formData,
        productId: '1',
      });
    }

    return await productMutation.mutateAsync({
      type: ProductMutationType.CREATE,
      data: formData,
    });
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
                    selectedCategory={form.getValues('category') as number}
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
          {!props.isEdit && (
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
                      className="flex h-72 items-center justify-center"
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}

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

export default HandleProductForm;
