import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wishlist } from './schema/wishlist.schema';
import mongoose, { Model } from 'mongoose';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

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

  async remove(): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.OK,
    };
  }

  async get(): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
