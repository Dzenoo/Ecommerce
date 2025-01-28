import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';

import { ProductModule } from '@/models/product/product.module';
import { UserModule } from '@/models/user/user.module';
import { AddressModule } from '@/models/address/address.module';
import { ReviewModule } from '@/models/review/review.module';
import { WishlistModule } from '@/models/wishlist/wishlist.module';
import { OrderModule } from '@/models/order/order.module';
import { CouponModule } from '@/models/coupon/coupon.module';
import { CartModule } from '@/models/cart/cart.module';
import { AuthModule } from '@/authentication/auth.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 25,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URL'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
      }),
    }),
    AuthModule,
    ProductModule,
    UserModule,
    AddressModule,
    ReviewModule,
    WishlistModule,
    OrderModule,
    CouponModule,
    CartModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
