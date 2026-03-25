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
    private readonly uploadService: UploadService,
  ) {}

  async create(data: {
    body: CreateProductDto;
    images: Express.Multer.File[];
  }): Promise<ResponseObject> {
    const { body, images } = data;

    if (!images || images.length === 0) {
      throw new NotAcceptableException('At least one image is required.');
    }

    if (
      body.discount !== undefined &&
      (body.discount < 0 || body.discount > 100)
    ) {
      throw new NotAcceptableException(
        'Discount must be between 0 and 100 (percentage).',
      );
    }

    const uploadedImages = await this.uploadService.uploadFiles(
      images,
      'product-images',
    );

    const imagesUrls = uploadedImages.map((image) => image.url);

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

    const productExists = await this.db.product.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

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
    const product = await this.db.product.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!product) throw new NotAcceptableException('Product does not exist.');

    await this.db.product.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

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
    const conditions: any = { isDeleted: { $ne: true } };

    if (search) {
      const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexSearch = new RegExp(escaped, 'i');
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
    const product = await this.db.product
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .lean()
      .exec();

    if (!product) {
      throw new NotAcceptableException('Product does not exist.');
    }

    return {
      statusCode: HttpStatus.OK,
      product,
    };
  }

  async getProductFeed(): Promise<string> {
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const currency = process.env.CURRENCY || 'RSD';

    const products = await this.db.product
      .find({ isDeleted: { $ne: true }, stock: { $gt: 0 } })
      .lean()
      .exec();

    const escapeXml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const stripHtml = (str: string) => str.replace(/<[^>]*>/g, '');

    const items = products
      .map((product: any) => {
        const discount = product.discount ?? 0;
        const salePrice =
          Math.round(product.price * (1 - discount / 100) * 100) / 100;
        const availability = product.stock > 0 ? 'in stock' : 'out of stock';
        const categoryId = product.category;
        const productUrl = `${siteUrl}/products/${categoryId}/${product._id}`;
        const imageUrl = product.images?.[0] || '';
        const description = stripHtml(product.description).slice(0, 5000);

        let itemXml = `
          <item>
          <g:id>${escapeXml(product._id.toString())}</g:id>
          <g:title>${escapeXml(product.name)}</g:title>
          <g:description>${escapeXml(description)}</g:description>
          <g:link>${escapeXml(productUrl)}</g:link>
          <g:image_link>${escapeXml(imageUrl)}</g:image_link>
          <g:availability>${availability}</g:availability>
          <g:price>${product.price} ${currency}</g:price>
          <g:brand>${escapeXml(siteUrl.replace(/https?:\/\//, ''))}</g:brand>
          <g:condition>new</g:condition>
        `;

        if (discount > 0) {
          itemXml += `\n      <g:sale_price>${salePrice} ${currency}</g:sale_price>`;
        }

        // Additional images
        product.images?.slice(1, 11).forEach((img: string) => {
          itemXml += `\n      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`;
        });

        itemXml += '\n    </item>';
        return itemXml;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
            <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
              <channel>
                <title>Product Feed</title>
                <link>${siteUrl}</link>
                <description>Product catalog feed for Meta Commerce Manager</description>
            ${items}
              </channel>
            </rss>`;
  }
}
