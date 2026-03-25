import {
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import mongoose from 'mongoose';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
  ) {}

  async create(
    body: CreateReviewDto,
    productId: string,
    userId: string,
  ): Promise<ResponseObject> {
    const [user, product] = await Promise.all([
      this.db.user.findById(userId),
      this.db.product.findOne({ _id: productId, isDeleted: { $ne: true } }),
    ]);

    if (!user || !product)
      throw new NotFoundException('User or product not found');

    const existingReview = await this.db.review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      throw new NotAcceptableException('You already reviewed this product.');
    }

    const review = await this.db.review.create({
      ...body,
      product: productId,
      user: userId,
    });

    await Promise.all([
      this.calculateAverageRating(productId),
      this.db.product.findByIdAndUpdate(productId, {
        $push: { reviews: review._id },
      }),
      this.db.user.findByIdAndUpdate(userId, {
        $push: { reviews: review._id },
      }),
    ]);

    return {
      statusCode: HttpStatus.CREATED,
      review,
      message: 'Successfully created review',
    };
  }

  async update(
    body: UpdateReviewDto,
    id: string,
    userId: string,
  ): Promise<ResponseObject> {
    const updatedReview = await this.db.review.findOneAndUpdate(
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
      message: 'Successfully updated review',
    };
  }

  async delete(
    id: string,
    productId: string,
    userId: string,
  ): Promise<ResponseObject> {
    const [user, product, review] = await Promise.all([
      this.db.user.findById(userId),
      this.db.product.findById(productId),
      this.db.review.findOne({ _id: id, user: userId }),
    ]);

    if (!user || !product)
      throw new NotFoundException('User or product not found');

    if (!review)
      throw new NotFoundException('Review not found or unauthorized');

    if (review.user.toString() !== userId) {
      throw new UnauthorizedException();
    }

    await Promise.all([
      this.db.review.deleteOne({ _id: id, user: userId }),
      this.db.product.findByIdAndUpdate(productId, {
        $pull: { reviews: id },
      }),
      this.db.user.findByIdAndUpdate(userId, {
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
    const { page = 1, limit = 10, sort = 'desc' } = query;

    const sortOptions: any = { createdAt: sort === 'desc' ? -1 : 1 };
    const conditions = { product: productId };

    const [reviews, totalReviews] = await Promise.all([
      this.db.review
        .find(conditions)
        .populate('user', 'username email _id')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOptions),
      this.db.review.countDocuments(conditions),
    ]);

    return {
      statusCode: HttpStatus.OK,
      data: {
        reviews,
        totalReviews,
      },
    };
  }

  async getAllByUser(
    query: GetReviewsDto,
    userId: string,
  ): Promise<ResponseObject> {
    const { page = 1, limit = 10, sort = 'desc' } = query;

    const sortOptions: any = { createdAt: sort === 'desc' ? -1 : 1 };
    const conditions = { user: new mongoose.Types.ObjectId(userId) };

    const [reviews, totalReviews] = await Promise.all([
      this.db.review
        .find(conditions)
        .populate('user', 'username email _id')
        .populate('product')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOptions),
      this.db.review.countDocuments(conditions),
    ]);

    return {
      statusCode: HttpStatus.OK,
      data: {
        reviews,
        totalReviews,
      },
    };
  }

  private async calculateAverageRating(productId: string): Promise<void> {
    const result = await this.db.review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    const averageRating = result.length > 0 ? result[0].avgRating : 0;

    await this.db.product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10,
    });
  }
}
