import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';

import { Coupon, CouponSchema } from './schema/coupon.schema';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    CartModule,
    UserModule,
  ],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
