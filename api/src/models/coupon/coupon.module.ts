import { Module } from '@nestjs/common';

import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';

@Module({
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
