import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileService } from '@/common/modules/file/file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
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
  ) {}

  async updateProduct() {}

  async deleteProduct() {}

  async getAllProducts() {}

  async getOneProduct() {}
}
