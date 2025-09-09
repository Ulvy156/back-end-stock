import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import apiResponse from 'src/common/helpers/apiResponse';
import { apiError } from 'src/common/helpers/apiError';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: createProductDto,
      });
      return apiResponse(201, 'Product created', product);
    } catch (error) {
      return apiError(error);
    }
  }

  async findAll() {
    try {
      const products = await this.prisma.product.findMany();
      return apiResponse(200, 'Product list', products);
    } catch (error) {
      return apiError(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return apiResponse(200, 'Product', product);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      return apiResponse(200, 'Product updated');
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.delete({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
    } catch (error) {
      return apiError(error);
    }
  }
}
