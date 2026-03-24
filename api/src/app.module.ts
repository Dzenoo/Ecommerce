import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { ClerkWebhookModule } from './common/modules/clerk/clerk-webhook.module';
import { DatabaseModule } from './common/modules/database/database.module';
import { UserModule } from '@/models/user/user.module';
import { ProductModule } from '@/models/product/product.module';
import { CartModule } from '@/models/cart/cart.module';
import { OrderModule } from '@/models/order/order.module';
import { AddressModule } from '@/models/address/address.module';
import { ReviewModule } from '@/models/review/review.module';
import { WishlistModule } from '@/models/wishlist/wishlist.module';
import { AnalyticsModule } from './common/modules/analytics/analytics.module';

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
    // Shared / Global
    DatabaseModule,

    // Auth & Security
    ClerkWebhookModule,

    // Domain
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    AddressModule,
    ReviewModule,
    WishlistModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
