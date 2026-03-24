import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { WishlistService } from './wishlist.service';

import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { ClerkRolesGuard } from '@/common/guards/clerk-roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';

import { User } from '@/common/decorators/user.decorator';

import { ParseMongoIdPipe } from '@/common/pipes/parse-mongo-id.pipe';
import { GetWishlistDto } from './dto/get-wishlist.dto';

@Controller('/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('/add/:productId')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async addToWishlist(
    @User('userId') userId: string,
    @Param('productId', ParseMongoIdPipe) productId: string,
  ) {
    return await this.wishlistService.add(userId, productId);
  }

  @Patch('/remove/:productId')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async removeFromWishlist(
    @User('userId') userId: string,
    @Param('productId', ParseMongoIdPipe) productId: string,
  ) {
    return await this.wishlistService.remove(userId, productId);
  }

  @Get()
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async getWishlist(
    @Query() query: GetWishlistDto,
    @User('userId') userId: string,
  ) {
    return await this.wishlistService.get(query, userId);
  }
}
