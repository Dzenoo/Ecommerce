import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  async update(data: {
    body: UpdateCategoryDto;
    id: string;
  }): Promise<ResponseObject> {
    const { body, id } = data;

    const categoryExists = await this.categoryModel.findById(id);

    if (!categoryExists) {
      throw new NotAcceptableException('Category does not exist.');
    }

    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      { $set: body },
      {
        new: true,
        runValidators: true,
        strict: true,
      },
    );

    if (!category) {
      throw new NotAcceptableException('Category could not be updated.');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Category updated successfully.',
    };
  }

  async delete(id: string) {
    const categoryExists = await this.categoryModel.findById(id);

    if (!categoryExists) {
      throw new NotAcceptableException('Category does not exist.');
    }

    const category = await this.categoryModel.findByIdAndDelete(id);

    if (!category) {
      throw new NotAcceptableException('Category could not be deleted.');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Category deleted successfully.',
    };
  }

  async getAll() {}

  async getOne() {}
}
