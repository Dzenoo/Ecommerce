import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CouponService } from './coupon.service';

import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { ClerkRolesGuard } from '@/common/guards/clerk-roles.guard';

import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';

import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller('/coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('/create')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async createCoupon(@Body() body: CreateCouponDto) {
    return this.couponService.create(body);
  }

  @Patch('/update/:id')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async updateCoupon(@Body() body: UpdateCouponDto, @Param('id') id: string) {
    return this.couponService.update(id, body);
  }

  @Delete('/delete/:id')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async deleteCoupon(@Param('id') id: string) {
    return this.couponService.delete(id);
  }

  @Get('/all')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async getCoupons(@Query('active') active?: boolean) {
    return this.couponService.getAll(active);
  }

  @Get('/:id')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async getCoupon(@Param('id') id: string) {
    return this.couponService.getOne(id);
  }

  @Post('/apply/:cartId')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async applyCoupon(
    @Param('cartId') cartId: string,
    @Body('couponCode') couponCode: string,
  ) {
    return this.couponService.apply(cartId, couponCode);
  }
}
