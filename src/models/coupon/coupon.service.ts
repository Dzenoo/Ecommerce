import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Coupon, CouponDocument } from './schema/coupon.schema';

import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

import { CartService } from '../cart/cart.service';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
    private readonly cartService: CartService,
  ) {}

  async create(body: CreateCouponDto): Promise<ResponseObject> {
    const coupon = await this.couponModel.create(body);
    if (!coupon)
      throw new NotAcceptableException('Coupon could not be created');

    return {
      statusCode: HttpStatus.CREATED,
      coupon,
      message: 'Coupon created successfully',
    };
  }

  async update(id: string, body: UpdateCouponDto): Promise<ResponseObject> {
    const coupon = await this.couponModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) throw new NotFoundException('Coupon not found');

    return {
      statusCode: HttpStatus.OK,
      coupon,
      message: 'Coupon updated successfully',
    };
  }

  async delete(id: string): Promise<ResponseObject> {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');

    await this.cartService.findAndUpdateMany(
      {},
      { $unset: { couponApplied: '' } },
    );
    await this.couponModel.findByIdAndDelete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon deleted successfully',
    };
  }

  async getAll(active: boolean): Promise<ResponseObject> {
    const query: any = {};

    if (active !== undefined) {
      query.active = active;
    }

    const coupons = await this.couponModel.find(query);

    return {
      statusCode: HttpStatus.OK,
      coupons,
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');

    return {
      statusCode: HttpStatus.OK,
      coupon,
    };
  }

  async apply(cartId: string, couponCode: string): Promise<ResponseObject> {
    const cart = await this.cartService.findOne({ _id: cartId });
    if (!cart) throw new NotFoundException('Cart not found');

    if (cart.couponApplied) {
      throw new NotAcceptableException(
        `A coupon has already been applied to this cart`,
      );
    }

    const coupon = await this.validateCoupon(couponCode, cart.user.toString());
    if (!coupon) throw new NotFoundException('Invalid or expired coupon');

    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > cart.totalPrice) {
      discountAmount = cart.totalPrice;
    }

    const updatedCart = await this.cartService.findOneByIdAndUpdate(cartId, {
      totalPrice: cart.totalPrice - discountAmount,
      couponApplied: coupon.code,
    });

    await this.couponModel.findByIdAndUpdate((coupon as CouponDocument)._id, {
      $inc: { usageCount: 1 },
    });

    return {
      statusCode: HttpStatus.OK,
      cart: updatedCart,
      message: `Coupon applied successfully. You saved ${discountAmount}!`,
    };
  }

  async validateCoupon(couponCode: string, userId: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code: couponCode });
    if (!coupon) {
      throw new NotFoundException('Invalid coupon code');
    }

    if (!coupon.active || new Date(coupon.expirationDate) < new Date()) {
      throw new NotAcceptableException('Coupon expired or inactive');
    }

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      throw new NotAcceptableException('Coupon usage limit reached');
    }

    if (
      Array.isArray(coupon.userLimit) &&
      coupon.userLimit.length > 0 &&
      !coupon.userLimit.includes(new mongoose.Types.ObjectId(userId))
    ) {
      throw new NotAcceptableException('User has reached coupon limit');
    }

    return coupon;
  }
}
