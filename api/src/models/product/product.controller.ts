import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
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

import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('images', 10))
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateProduct(@Body() body: UpdateProductDto, @Param('id') id: string) {
    return await this.productService.update({ body, id });
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.delete(id);
  }

  @Get('/all')
  async getAllProducts(@Query() query: GetProductsDto) {
    return await this.productService.getAll(query);
  }

  @Get('/:id')
  async getOneProduct(@Param('id') id: string) {
    return await this.productService.getOne(id);
  }
}
