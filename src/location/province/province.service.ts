import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import apiResponse from 'src/common/helpers/apiResponse';
import { apiError } from 'src/common/helpers/apiError';
import { HttpStatusCode } from 'src/enum/http-status';

@Injectable()
export class ProvinceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProvinceDto: CreateProvinceDto) {
    try {
      const province = await this.prisma.provinces.create({
        data: createProvinceDto,
      });
      return apiResponse(201, 'Province created successfully', province);
    } catch (error) {
      return apiError(error);
    }
  }

  async findAll() {
    try {
      const provinces = await this.prisma.provinces.findMany();
      return apiResponse(HttpStatusCode.OK, 'Provinces', provinces);
    } catch (error) {
      return apiError(error);
    }
  }

  private async getProvinceById(id: number) {
    const province = await this.prisma.provinces.findUnique({
      where: { id },
    });
    if (!province) {
      throw new NotFoundException('Province not found');
    }
    return province;
  }

  async findOne(id: number) {
    try {
      const province = await this.getProvinceById(id);
      return apiResponse(HttpStatusCode.OK, 'Province', province);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: number, updateProvinceDto: UpdateProvinceDto) {
    try {
      await this.getProvinceById(id);
      await this.prisma.provinces.update({
        where: { id },
        data: updateProvinceDto,
      });
      return apiResponse(HttpStatusCode.OK, 'Province updated');
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.getProvinceById(id);
      await this.prisma.provinces.delete({
        where: { id },
      });
      return apiResponse(HttpStatusCode.OK, 'Province updated');
    } catch (error) {
      return apiError(error);
    }
  }
}
