import { Module } from '@nestjs/common';

import { CartModule } from '../cart/cart.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [CartModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
