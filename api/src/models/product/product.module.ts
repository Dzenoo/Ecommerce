import { Module } from '@nestjs/common';

import { UploadModule } from '@/common/modules/upload/upload.module';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [UploadModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
