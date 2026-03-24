import {
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

import { UploadService } from '@/common/modules/upload/upload.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
    private readonly UploadService: UploadService,
  ) {}

  async create(data: {
    body: CreateProductDto;
    images: Express.Multer.File[];
  }): Promise<ResponseObject> {
    const { body, images } = data;

    if (images.length === 0 || !images) {
      throw new NotAcceptableException('At least one image is required.');
    }

    const uploadedImages = await this.UploadService.uploadFiles(
      images,
      'product-images',
    );

    const imagesUrls = uploadedImages.map((image) => image.url);

    if (body.discount > body.price) {
      throw new NotAcceptableException(
        'Discount cannot be greater than price.',
      );
    }

    const product = await this.db.product.create({
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

    const productExists = await this.db.product.findById(id);

    if (!productExists) {
      throw new NotAcceptableException('Product does not exist.');
    }

    const product = await this.db.product.findByIdAndUpdate(
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
    const productExists = await this.db.product.findById(id);
    if (!productExists)
      throw new NotAcceptableException('Product does not exist.');

    const imageKeys = productExists.images.map((image) =>
      image.split('/').pop(),
    );

    await this.UploadService.deleteFiles(imageKeys, 'product-images');

    const reviews = await this.db.review.find({ product: id });
    const userIds = reviews.map((review) => review.user);

    await Promise.all([
      this.db.product.findByIdAndDelete(id),
      this.db.review.deleteMany({ product: id }),
      this.db.user.updateMany(
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

    const products = await this.db.product
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const totalProducts = await this.db.product.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      products,
      totalProducts,
    };
  }

  async getOne(id: string) {
    const product = await this.db.product.findById(id).lean().exec();

    if (!product) {
      throw new NotAcceptableException('Product does not exist.');
    }

    return {
      statusCode: HttpStatus.OK,
      product,
    };
  }
}
