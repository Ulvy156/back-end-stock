import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiError } from 'src/common/helpers/apiError';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/enum/http-status';

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
      return apiResponse(HttpStatusCode.OK, 'Categories list', categories);
    } catch (error) {
      return apiError(error);
    }
  }

  private async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findOne(id: string) {
    try {
      const category = await this.getCategoryById(id);
      return apiResponse(HttpStatusCode.OK, 'Category', category);
    } catch (error) {
      return apiError(error);
    }
  }

  async findCategoryWithProduct(id: string) {
    try {
      await this.getCategoryById(id);
      const categoryWithProducts = await this.prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
        },
      });
      return apiResponse(200, 'Category with products', categoryWithProducts);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.getCategoryById(id);
      await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
      return apiResponse(HttpStatusCode.OK, 'Category updated');
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.getCategoryById(id);
      await this.prisma.category.delete({
        where: { id },
      });

      return apiResponse(HttpStatusCode.OK, 'Category deleted');
    } catch (error) {
      return apiError(error);
    }
  }
}
