import {
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

import { Coupon, CouponDocument } from './schema/coupon.schema';

import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
  ) {}

  async create(body: CreateCouponDto): Promise<ResponseObject> {
    const coupon = await this.db.coupon.create(body);
    if (!coupon)
      throw new NotAcceptableException('Coupon could not be created');

    return {
      statusCode: HttpStatus.CREATED,
      coupon,
      message: 'Coupon created successfully',
    };
  }

  async update(id: string, body: UpdateCouponDto): Promise<ResponseObject> {
    const coupon = await this.db.coupon.findByIdAndUpdate(id, body, {
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
    const coupon = await this.db.coupon.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');

    await this.db.cart.updateMany({}, { $unset: { couponApplied: '' } });
    await this.db.coupon.findByIdAndDelete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon deleted successfully',
    };
  }

  async getAll(): Promise<ResponseObject> {
    const query: any = {};

    const coupons = await this.db.coupon.find(query);

    return {
      statusCode: HttpStatus.OK,
      coupons,
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    const coupon = await this.db.coupon.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');

    return {
      statusCode: HttpStatus.OK,
      coupon,
    };
  }

  async apply(cartId: string, couponCode: string): Promise<ResponseObject> {
    const cart = await this.db.cart.findOne({ _id: cartId });
    if (!cart) throw new NotFoundException('Cart not found');

    if (cart.couponApplied) {
      throw new NotAcceptableException(
        `A coupon has already been applied to this cart`,
      );
    }

    const coupon = await this.validateCoupon(couponCode, cart.user.toString());
    if (!coupon) throw new NotFoundException('Invalid or expired coupon');

    if (
      coupon.minPurchaseAmount &&
      cart.totalPrice < coupon.minPurchaseAmount
    ) {
      throw new NotAcceptableException(
        `Minimum purchase amount of ${coupon.minPurchaseAmount} required to use this coupon`,
      );
    }

    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > cart.totalPrice) {
      discountAmount = cart.totalPrice;
    }

    const updatedCart = await this.db.cart.findByIdAndUpdate(cartId, {
      totalPrice: cart.totalPrice - discountAmount,
      couponApplied: coupon.code,
    });

    const userUsage = (coupon as CouponDocument).usedBy?.find(
      (u) => u.userId === cart.user.toString(),
    );

    if (userUsage) {
      await this.db.coupon.findOneAndUpdate(
        {
          _id: (coupon as CouponDocument)._id,
          'usedBy.userId': cart.user.toString(),
        },
        { $inc: { usageCount: 1, 'usedBy.$.count': 1 } },
      );
    } else {
      await this.db.coupon.findByIdAndUpdate((coupon as CouponDocument)._id, {
        $inc: { usageCount: 1 },
        $push: { usedBy: { userId: cart.user.toString(), count: 1 } },
      });
    }

    return {
      statusCode: HttpStatus.OK,
      cart: updatedCart,
      message: `Coupon applied successfully. You saved ${discountAmount}!`,
    };
  }

  async validateCoupon(couponCode: string, userId: string): Promise<Coupon> {
    const coupon = await this.db.coupon.findOne({ code: couponCode });
    if (!coupon) {
      throw new NotFoundException('Invalid coupon code');
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      throw new NotAcceptableException('Coupon expired or inactive');
    }

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      throw new NotAcceptableException('Coupon usage limit reached');
    }

    const userUsage = coupon.usedBy?.find((u) => u.userId === userId);
    if (
      userUsage &&
      coupon.maxUsagePerUser &&
      userUsage.count >= coupon.maxUsagePerUser
    ) {
      throw new NotAcceptableException(
        `You have already used this coupon the maximum number of times`,
      );
    }

    return coupon;
  }
}
