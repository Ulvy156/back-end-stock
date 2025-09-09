import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import apiResponse from 'src/common/helpers/apiResponse';
import { apiError } from 'src/common/helpers/apiError';
import { HttpStatusCode } from 'src/enum/http-status';
import { FileuploadService } from 'src/fileupload/fileupload.service';
import { FilePath } from 'src/enum/fileupload.enum';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileupload: FileuploadService,
  ) {}

  async create(createProductDto: CreateProductDto[]) {
    try {
      const products = await this.prisma.$transaction(
        createProductDto.map((data) => this.prisma.product.create({ data })),
      );
      return apiResponse(201, 'Product created', products);
    } catch (error) {
      return apiError(error);
    }
  }

  async updateImageProduct(product_id: string, file: Express.Multer.File) {
    try {
      await this.getProductById(product_id);

      if (!file) {
        throw new BadRequestException('File is required');
      }
      const img_url = await this.fileupload.replaceFile(
        null,
        file,
        FilePath.PRODUCT,
      );
      await this.prisma.product.update({
        where: { id: product_id },
        data: {
          img_url,
        },
      });
      return apiResponse(200, 'Product image updated');
    } catch (error) {
      return apiError(error);
    }
  }

  async findAll() {
    try {
      const products = await this.prisma.product.findMany();
      return apiResponse(HttpStatusCode.OK, 'Product list', products);
    } catch (error) {
      return apiError(error);
    }
  }

  private async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findOne(id: string) {
    try {
      const product = await this.getProductById(id);
      return apiResponse(HttpStatusCode.OK, 'Product', product);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      await this.getProductById(id);
      await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      return apiResponse(HttpStatusCode.OK, 'Product updated');
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.getProductById(id);
      await this.prisma.product.delete({
        where: { id },
      });
      return apiResponse(HttpStatusCode.OK, 'Product deleted');
    } catch (error) {
      return apiError(error);
    }
  }
}
