import { Global, Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { DATABASE_MODELS_TOKEN, DatabaseModels } from './database.types';

import { User, UserSchema } from '@/models/user/schema/user.schema';
import { Product, ProductSchema } from '@/models/product/schema/product.schema';
import { Cart, CartSchema } from '@/models/cart/schema/cart.schema';
import { Order, OrderSchema } from '@/models/order/schema/order.schema';
import { Address, AddressSchema } from '@/models/address/schema/address.schema';
import { Review, ReviewSchema } from '@/models/review/schema/review.schema';
import {
  Wishlist,
  WishlistSchema,
} from '@/models/wishlist/schema/wishlist.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Product.name, schema: ProductSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Address.name, schema: AddressSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Wishlist.name, schema: WishlistSchema },
    ]),
  ],
  providers: [
    {
      provide: DATABASE_MODELS_TOKEN,
      useFactory: (
        user: DatabaseModels['user'],
        product: DatabaseModels['product'],
        cart: DatabaseModels['cart'],
        order: DatabaseModels['order'],
        address: DatabaseModels['address'],
        review: DatabaseModels['review'],
        wishlist: DatabaseModels['wishlist'],
      ): DatabaseModels => ({
        user,
        product,
        cart,
        order,
        address,
        review,
        wishlist,
      }),
      inject: [
        getModelToken(User.name),
        getModelToken(Product.name),
        getModelToken(Cart.name),
        getModelToken(Order.name),
        getModelToken(Address.name),
        getModelToken(Review.name),
        getModelToken(Wishlist.name),
      ],
    },
  ],
  exports: [DATABASE_MODELS_TOKEN, MongooseModule],
})
export class DatabaseModule {}
