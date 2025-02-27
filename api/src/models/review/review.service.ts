import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { DeleteResult, FilterQuery, Model } from 'mongoose';

import { Review, ReviewDocument } from './schema/review.schema';

import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async find(
    query: FilterQuery<Review> = {},
  ): Promise<Review[] | ReviewDocument[]> {
    return await this.reviewModel.find(query).exec();
  }

  async findAndDeleteMany(
    query: FilterQuery<Review> = {},
  ): Promise<DeleteResult> {
    return await this.reviewModel.deleteMany(query).exec();
  }

  async create(
    body: CreateReviewDto,
    productId: string,
    userId: string,
  ): Promise<ResponseObject> {
    const [user, product] = await Promise.all([
      this.userService.findById(userId),
      this.productService.findById(productId),
    ]);

    if (!user || !product)
      throw new NotFoundException('User or product not found');

    const existingReview = await this.reviewModel.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      throw new NotAcceptableException('You already reviewed this product.');
    }

    const review = await this.reviewModel.create({
      ...body,
      product: productId,
      user: userId,
    });

    await Promise.all([
      this.calculateAverageRating(productId),
      this.productService.findOneByIdAndUpdate(productId, {
        $push: { reviews: review._id },
      }),
      this.userService.findOneByIdAndUpdate(userId, {
        $push: { reviews: review._id },
      }),
    ]);

    return {
      statusCode: HttpStatus.CREATED,
      review,
    };
  }

  async update(
    body: UpdateReviewDto,
    id: string,
    userId: string,
  ): Promise<ResponseObject> {
    const updatedReview = await this.reviewModel.findOneAndUpdate(
      { _id: id, user: userId },
      body,
      { new: true, runValidators: true },
    );

    if (!updatedReview)
      throw new NotFoundException('Review not found or unauthorized');

    await this.calculateAverageRating(String(updatedReview.product));

    return {
      statusCode: HttpStatus.OK,
      updatedReview,
    };
  }

  async delete(
    id: string,
    productId: string,
    userId: string,
  ): Promise<ResponseObject> {
    const [user, product, review] = await Promise.all([
      this.userService.findById(userId),
      this.productService.findById(productId),
      this.reviewModel.findOne({ _id: id, user: userId }),
    ]);

    if (!user || !product)
      throw new NotFoundException('User or product not found');

    if (!review)
      throw new NotFoundException('Review not found or unauthorized');

    await Promise.all([
      this.reviewModel.deleteOne({ _id: id, user: userId }),
      this.productService.findOneByIdAndUpdate(productId, {
        $pull: { reviews: id },
      }),
      this.userService.findOneByIdAndUpdate(userId, {
        $pull: { reviews: id },
      }),
    ]);

    await this.calculateAverageRating(productId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Review deleted successfully',
    };
  }

  async getAll(
    query: GetReviewsDto,
    productId: string,
  ): Promise<ResponseObject> {
    const { skip = 0, limit = 10, sort = 'desc' } = query;

    const sortOptions: any = { createdAt: sort === 'desc' ? -1 : 1 };

    const reviews = await this.reviewModel
      .find({
        product: productId,
      })
      .populate('user', 'first_name last_name _id')
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

    const totalReviews = await this.reviewModel.countDocuments();

    return {
      statusCode: HttpStatus.OK,
      data: {
        reviews,
        totalReviews,
        skip,
        limit,
      },
    };
  }

  private async calculateAverageRating(productId: string): Promise<any> {
    const allReviews = await this.reviewModel
      .find({ product: productId })
      .lean()
      .exec();

    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((acc, review) => acc + review.rating, 0) /
          allReviews.length
        : 0;

    return await this.productService.findOneByIdAndUpdate(productId, {
      averageRating: averageRating,
    });
  }
}
