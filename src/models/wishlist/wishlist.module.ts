import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
