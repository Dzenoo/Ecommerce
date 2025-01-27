import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

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

    const review = await this.reviewModel.create({
      ...body,
      product: productId,
      user: userId,
      replies: [],
    });

    await this.userService.findOneByIdAndUpdate(userId, {
      $push: { reviews: review._id },
    });

    await this.productService.findOneByIdAndUpdate(productId, {
      $push: { reviews: review._id },
    });

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

    return {
      statusCode: HttpStatus.OK,
      updatedReview,
    };
  }

  async delete(id: string): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.OK,
    };
  }

  async getAll(query: GetReviewsDto): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
