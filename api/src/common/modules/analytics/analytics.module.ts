import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { UserModule } from '@/models/user/user.module';
import { ProductModule } from '@/models/product/product.module';
import { OrderModule } from '@/models/order/order.module';

@Module({
  imports: [UserModule, ProductModule, OrderModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
