import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Wishlist } from './schema/wishlist.schema';

import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

import { GetWishlistDto } from './dto/get-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private readonly wishlistModel: Model<Wishlist>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  async add(userId: string, productId: string): Promise<ResponseObject> {
    const product = await this.productService.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    let wishlist = await this.wishlistModel.findOne({ user: userId });
    const mongooseProductId = new mongoose.Types.ObjectId(productId);

    if (!wishlist) {
      wishlist = await this.wishlistModel.create({
        user: userId,
        products: [mongooseProductId],
      });

      await this.userService.findOneByIdAndUpdate(userId, {
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
    const wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) throw new NotFoundException('Wishlist not found');

    if (wishlist.user.toString() !== userId) throw new UnauthorizedException();

    const mongooseProductId = new mongoose.Types.ObjectId(productId);
    if (!wishlist.products.includes(mongooseProductId)) {
      throw new NotAcceptableException('Product is not in the wishlist');
    }

    const updatedWishlist = await this.wishlistModel.findByIdAndUpdate(
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
    const wishlist = await this.wishlistModel
      .findOne({ user: userId })
      .select('_id products')
      .populate({
        path: 'products',
        options: {
          skip: (query.page - 1) * query.limit,
          limit: query.limit,
        },
      })
      .exec();

    if (!wishlist) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        wishlist: {
          products: [],
        },
        totalProducts: 0,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      wishlist,
      totalProducts: wishlist.products.length,
    };
  }
}
