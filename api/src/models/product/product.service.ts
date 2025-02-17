import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Product } from './schema/product.schema';

import { FileService } from '@/common/modules/file/file.service';
import { ReviewService } from '../review/review.service';
import { UserService } from '../user/user.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ReviewService))
    private readonly reviewService: ReviewService,
  ) {}

  async countDocuments(query: FilterQuery<Product> = {}): Promise<number> {
    return await this.productModel.countDocuments(query).exec();
  }

  async findOneByIdAndUpdate(
    id: string,
    update: UpdateQuery<Product> = {},
  ): Promise<void> {
    await this.productModel.findByIdAndUpdate(id, update).exec();
  }

  async findById(id: string): Promise<Product> {
    return this.productModel.findById(id).lean().exec();
  }

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

    if (body.discount > body.price) {
      throw new NotAcceptableException(
        'Discount cannot be greater than price.',
      );
    }

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
    if (!productExists)
      throw new NotAcceptableException('Product does not exist.');

    const imageKeys = productExists.images.map((image) =>
      image.split('/').pop(),
    );

    await this.fileService.deleteFiles(imageKeys, 'product-images');

    const reviews = await this.reviewService.find({ product: id });
    const userIds = reviews.map((review) => review.user);

    await Promise.all([
      this.productModel.findByIdAndDelete(id),
      this.reviewService.findAndDeleteMany({ product: id }),
      this.userService.findAndUpdateMany(
        { _id: { $in: userIds } },
        { $pull: { reviews: { product: id } } },
      ),
    ]);

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

    if (attributes) {
      Object.entries(attributes).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          conditions[`attributes.${key}`] = { $in: values };
        }
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
