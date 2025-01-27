import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';

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
}
