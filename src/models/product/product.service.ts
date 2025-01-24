import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './schema/product.schema';

import { CreateProductDto } from './dto/create-product.dto';

import { FileService } from '@/common/modules/file/file.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly fileService: FileService,
  ) {}

  async create(data: {
    body: CreateProductDto;
    images: Express.Multer.File[];
  }): Promise<ResponseObject> {
    const { body, images } = data;

    if (images.length === 0 || !images) {
      throw new NotAcceptableException('At least one image is required.');
    }

    const uploadedImages = await this.fileService.uploadFiles(
      images,
      'product-images',
    );

    const imagesUrls = uploadedImages.map((image) => image.url);

    const product = await this.productModel.create({
      ...body,
      images: imagesUrls,
    });

    if (!product) {
      throw new NotAcceptableException('Product could not be created.');
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product created successfully.',
    };
  }

  async update() {}

  async delete() {}

  async getAll() {}

  async getOne() {}
}
