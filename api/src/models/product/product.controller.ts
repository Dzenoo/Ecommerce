import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ProductService } from './product.service';

import { FilesInterceptor } from '@nestjs/platform-express';

import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';

import { ClerkRolesGuard } from '@/common/guards/clerk-roles.guard';
import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';

import { ParseMongoIdPipe } from '@/common/pipes/parse-mongo-id.pipe';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('images', 10))
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|webp)' }),
          new MaxFileSizeValidator({
            maxSize: 6 * 1024 * 1024,
            message: 'Files is too large.',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    images: Express.Multer.File[],
  ) {
    return await this.productService.create({ body, images });
  }

  @Patch('/update/:id')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async updateProduct(
    @Body() body: UpdateProductDto,
    @Param('id', ParseMongoIdPipe) id: string,
  ) {
    return await this.productService.update({ body, id });
  }

  @Delete('/delete/:id')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async deleteProduct(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.productService.delete(id);
  }

  @Get('/all')
  async getAllProducts(@Query() query: GetProductsDto) {
    return await this.productService.getAll(query);
  }

  @Get('/feed')
  @Header('Content-Type', 'application/xml')
  async getProductFeed() {
    return await this.productService.getProductFeed();
  }

  @Get('/:id')
  async getOneProduct(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.productService.getOne(id);
  }
}
