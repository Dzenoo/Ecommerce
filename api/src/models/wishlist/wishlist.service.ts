import {
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import mongoose from 'mongoose';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

import { GetWishlistDto } from './dto/get-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
  ) {}

  async add(userId: string, productId: string): Promise<ResponseObject> {
    const product = await this.db.product.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    let wishlist = await this.db.wishlist.findOne({ user: userId });
    const mongooseProductId = new mongoose.Types.ObjectId(productId);

    if (!wishlist) {
      wishlist = await this.db.wishlist.create({
        user: userId,
        products: [mongooseProductId],
      });

      await this.db.user.findByIdAndUpdate(userId, {
        wishlist: wishlist._id,
      });
    } else {
      if (
        wishlist.products.includes(
          new mongoose.Types.ObjectId(mongooseProductId),
        )
      )
        throw new NotAcceptableException('Product already in wishlist');

      wishlist.products.push(mongooseProductId);
    }

    await wishlist.save();

    return {
      statusCode: HttpStatus.OK,
      message: 'Product added to wishlist',
    };
  }

  async remove(userId: string, productId: string): Promise<ResponseObject> {
    const wishlist = await this.db.wishlist.findOne({ user: userId });
    if (!wishlist) throw new NotFoundException('Wishlist not found');

    if (wishlist.user.toString() !== userId) throw new UnauthorizedException();

    const mongooseProductId = new mongoose.Types.ObjectId(productId);
    if (!wishlist.products.includes(mongooseProductId)) {
      throw new NotAcceptableException('Product is not in the wishlist');
    }

    const updatedWishlist = await this.db.wishlist.findByIdAndUpdate(
      wishlist._id,
      { $pull: { products: mongooseProductId } },
      { new: true, runValidators: true },
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Product removed from wishlist',
      wishlist: updatedWishlist,
    };
  }

  async get(query: GetWishlistDto, userId: string): Promise<ResponseObject> {
    const wishlist = await this.db.wishlist
      .findOne({ user: userId })
      .select('_id products')
      .lean()
      .exec();

    if (!wishlist) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        wishlist: { products: [] },
        totalProducts: 0,
      };
    }

    const totalProducts = wishlist.products.length;
    const skip = (query.page - 1) * query.limit;
    const paginatedIds = wishlist.products.slice(skip, skip + query.limit);

    const products = await this.db.product
      .find({ _id: { $in: paginatedIds }, isDeleted: { $ne: true } })
      .lean()
      .exec();

    return {
      statusCode: HttpStatus.OK,
      wishlist: { _id: wishlist._id, products },
      totalProducts,
    };
  }
}
