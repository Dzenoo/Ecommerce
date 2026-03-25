'use client';

import {
  ProductQueryType,
  useProductQuery,
} from '@shared/hooks/queries/useProduct.query';
import { useCurrentUser } from '@shared/hooks/useCurrentUser';

import { getCategory } from '@shared/lib/utils';

import ProductImages from '@/components/root/products/details/ProductImages';
import ProductInformation from '@/components/root/products/details/ProductInformation';
import NotFound from '@shared/components/shared/NotFound';
import BreadcrumbProducts from '@/components/root/products/BreadcrumbProducts';
import LoadingProductDetails from '@shared/components/shared/loading/products/LoadingProductDetails';
import Reviews from '@/components/root/products/details/reviews/Reviews';

type ProductDetailsProps = {
  productId: string;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const { isAuthenticated } = useCurrentUser();

  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ONE,
    params: { productId: productId },
  });

  if (isLoading) {
    return <LoadingProductDetails />;
  }

  if (!data) {
    return <NotFound />;
  }

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-10 max-xl:grid-cols-1 max-sm:gap-20">
      <div className="space-y-10">
        <BreadcrumbProducts
          page={data.product.name}
          category={getCategory('id', data.product.category)}
        />
        <ProductImages images={data.product.images} />
        {isAuthenticated && (
          <div className="max-xl:hidden">
            <Reviews productId={productId} />
          </div>
        )}
      </div>
      <div>
        <ProductInformation product={data.product} />
      </div>
      {isAuthenticated && (
        <div className="hidden max-xl:block">
          <Reviews productId={productId} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
