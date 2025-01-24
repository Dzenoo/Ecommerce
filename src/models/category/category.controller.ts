import { Body, Controller, Post } from '@nestjs/common';

import { CategoryService } from './category.service';

import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  async createCategory(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }
}
