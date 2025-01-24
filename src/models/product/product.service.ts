import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './schema/product.schema';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

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

  async update(data: {
    body: UpdateProductDto;
    id: string;
  }): Promise<ResponseObject> {
    const { body, id } = data;

    const productExists = await this.productModel.findById(id);

    if (!productExists) {
      throw new NotAcceptableException('Product does not exist.');
    }

    const product = await this.productModel.findByIdAndUpdate(
      id,
      { $set: body },
      {
        new: true,
        runValidators: true,
        strict: true,
      },
    );

    if (!product) {
      throw new NotAcceptableException('Product could not be updated.');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Product updated successfully.',
    };
  }

  async delete(id: string) {
    const productExists = await this.productModel.findById(id);

    if (!productExists) {
      throw new NotAcceptableException('Product does not exist.');
    }

    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotAcceptableException('Product could not be deleted.');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Product deleted successfully.',
    };
  }

  async getAll({
    page = 1,
    limit = 10,
    search,
    sort,
    category,
    attributes,
    price,
  }: GetProductsDto): Promise<ResponseObject> {
    const conditions: any = {};

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { name: { $regex: regexSearch } },
        { description: { $regex: regexSearch } },
      ];
    }

    if (category) {
      conditions.category = category;
    }

    if (attributes && attributes.length > 0) {
      attributes.forEach((attr) => {
        const [key, value] = attr.split(':');
        conditions[`attributes.${key}`] = value;
      });
    }

    if (price) {
      conditions.price = {};
      if (price.min !== undefined) {
        conditions.price.$gte = price.min;
      }
      if (price.max !== undefined) {
        conditions.price.$lte = price.max;
      }
    }

    const sortOptions: any = { createdAt: sort === 'desc' ? -1 : 1 };

    const products = await this.productModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const totalProducts = await this.productModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      products,
      totalProducts,
    };
  }

  async getOne(id: string) {
    const product = await this.productModel.findById(id).lean().exec();

    if (!product) {
      throw new NotAcceptableException('Product does not exist.');
    }

    return {
      statusCode: HttpStatus.OK,
      product,
    };
  }
}
