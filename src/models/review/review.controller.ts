import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create/:productId')
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Body() body: CreateReviewDto,
    @User('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.reviewService.create(body, productId, userId);
  }

  @Patch('/update/:reviewId')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Body() body: UpdateReviewDto,
    @User('userId') userId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewService.update(body, reviewId, userId);
  }

  @Delete('/delete/:reviewId/:productId')
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @Param('productId') productId: string,
    @User('userId') userId: string,
  ) {
    return await this.reviewService.delete(reviewId, productId, userId);
  }
}
