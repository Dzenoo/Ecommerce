import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

import { CategoryService } from './category.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  async createCategory(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }

  @Patch('/update/:id')
  async updateCategory(
    @Body() body: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    return await this.categoryService.update({ body, id });
  }

  @Delete('/delete/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.delete(id);
  }
}
