import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CouponService } from './coupon.service';

import { Admin } from '@/common/decorators/admin.decorator';
import { AdminGuard } from '@/authentication/guards/admin-auth.guard';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';

@Controller('/coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('/create')
  @UseGuards(AdminGuard)
  @Admin()
  async createCoupon() {}

  @Patch('/update/:id')
  @UseGuards(AdminGuard)
  @Admin()
  async updateCoupon() {}

  @Delete('/delete/:id')
  @UseGuards(AdminGuard)
  @Admin()
  async deleteCoupon() {}

  @Get('/all')
  @UseGuards(AdminGuard)
  @Admin()
  async getCoupons() {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getCoupon() {}

  @Post('/apply')
  @UseGuards(JwtAuthGuard)
  async applyCoupon() {}

  @Post('/validate')
  @UseGuards(JwtAuthGuard)
  async validateCoupon() {}
}
