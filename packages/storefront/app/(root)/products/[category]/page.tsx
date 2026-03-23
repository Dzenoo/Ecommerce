import Products from '@/components/root/products/Products';

const ProductsPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;

  return (
    <section className="pt-5">
      <Products category={category} />
    </section>
  );
};

export default ProductsPage;
