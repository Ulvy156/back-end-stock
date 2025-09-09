import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiError } from 'src/common/helpers/apiError';
import apiResponse from 'src/common/helpers/apiResponse';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: createCategoryDto,
      });
      return apiResponse(201, 'Category created', category);
    } catch (error) {
      return apiError(error);
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany();
      return apiResponse(200, 'Categories list', categories);
    } catch (error) {
      return apiError(error);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return apiResponse(200, 'Category', category);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
      return apiResponse(200, 'Category updated');
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      return apiError(error);
    }
  }
}
