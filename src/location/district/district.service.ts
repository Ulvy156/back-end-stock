import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import apiResponse from 'src/common/helpers/apiResponse';
import { apiError } from 'src/common/helpers/apiError';
import { HttpStatusCode } from 'src/enum/http-status';

@Injectable()
export class DistrictService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDistrictDto: CreateDistrictDto) {
    try {
      const district = await this.prisma.districts.create({
        data: createDistrictDto,
      });
      return apiResponse(201, 'District created', district);
    } catch (error) {
      return apiError(error);
    }
  }

  async findAll() {
    try {
      const districts = await this.prisma.districts.findMany();
      return apiResponse(HttpStatusCode.OK, 'Districts', districts);
    } catch (error) {
      return apiError(error);
    }
  }

  private async getDistrictById(id: string) {
    const category = await this.prisma.districts.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('District not found');
    }
    return category;
  }

  async findOne(id: string) {
    try {
      const district = await this.getDistrictById(id);
      return apiResponse(HttpStatusCode.OK, 'Districts', district);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    try {
      await this.getDistrictById(id);
      await this.prisma.districts.update({
        where: { id },
        data: updateDistrictDto,
      });
      return apiResponse(HttpStatusCode.OK, 'District updated');
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.getDistrictById(id);
      await this.prisma.districts.delete({
        where: { id },
      });
      return apiResponse(HttpStatusCode.OK, 'District deleted');
    } catch (error) {
      return apiError(error);
    }
  }
}
