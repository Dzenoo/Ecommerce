import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';

import { Category } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(body: CreateCategoryDto): Promise<ResponseObject> {
    const existingCategory = await this.categoryModel.findOne({
      name: body.name,
    });

    if (existingCategory) {
      throw new NotAcceptableException('Category already exists');
    }

    if (body.parentCategory) {
      const parent = await this.categoryModel.findById(body.parentCategory);
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const newCategory = await this.categoryModel.create({
      name: body.name,
      parentCategory: body.parentCategory || null,
      filters: body.filters || [],
    });

    if (!newCategory) {
      throw new NotAcceptableException('Category not created');
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Category created successfully',
    };
  }

  async update() {}

  async delete() {}

  async getAll() {}

  async getOne() {}
}
