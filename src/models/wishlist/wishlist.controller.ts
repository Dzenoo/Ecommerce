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
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { GetWishlistDto } from './dto/get-wishlist.dto';

@Controller('/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('/add/:productId')
  @UseGuards(JwtAuthGuard)
  async addToWishlist(
    @User('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.wishlistService.add(userId, productId);
  }

  @Patch('/remove/:productId')
  @UseGuards(JwtAuthGuard)
  async removeFromWishlist(
    @User('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.wishlistService.remove(userId, productId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWishlist(
    @Query() query: GetWishlistDto,
    @User('userId') userId: string,
  ) {
    return await this.wishlistService.get(query, userId);
  }
}
