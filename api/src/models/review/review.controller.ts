import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ReviewService } from './review.service';

import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';
import { User } from '@/common/decorators/user.decorator';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';

@Controller('/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async createReview(
    @Body() body: CreateReviewDto,
    @User('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.reviewService.create(body, productId, userId);
  }

  @Patch('/update/:reviewId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async updateReview(
    @Body() body: UpdateReviewDto,
    @User('userId') userId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewService.update(body, reviewId, userId);
  }

  @Delete('/delete/:reviewId/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @Param('productId') productId: string,
    @User('userId') userId: string,
  ) {
    return await this.reviewService.delete(reviewId, productId, userId);
  }

  @Get('/all/:productId')
  @UseGuards(JwtAuthGuard)
  async getReviews(
    @Query() query: GetReviewsDto,
    @Param('productId') productId: string,
  ) {
    return await this.reviewService.getAll(query, productId);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async getReviewsByUser(
    @Query() query: GetReviewsDto,
    @User('userId') userId: string,
  ) {
    return await this.reviewService.getAllByUser(query, userId);
  }
}
