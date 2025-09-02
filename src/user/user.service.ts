import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/common/constant/http-status.constant';
import { apiError } from 'src/common/helpers/apiError';
import { apiResponseType } from 'src/common/constant/response-type';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<apiResponseType> {
    try {
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hash, // use hashed password
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'User Created', user);
    } catch (error: unknown) {
      return apiError(error);
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<apiResponseType> {
    try {
      const user = await this.prisma.user.findFirst({ where: { id } });

      if (!user) {
        return apiResponse(404, 'User not found', null);
      }

      return apiResponse(HttpStatusCode.OK, 'Success', user);
    } catch (error) {
      return apiError(error);
    }
  }

  async findOneWithWarehouse(id: string): Promise<apiResponseType> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
        include: {
          warehouses: {
            include: { warehouse: true },
          },
        },
      });

      if (!user) {
        return apiResponse(404, 'User not found', null);
      }

      return apiResponse(HttpStatusCode.OK, 'Success', user);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const currentUser = await this.prisma.user.findFirst({ where: { id } });

      if (!currentUser) {
        return apiResponse(404, 'User not found', null);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return apiResponse(
        HttpStatusCode.OK,
        'Updated user success',
        updatedUser,
      );
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: string) {
    try {
      const currentUser = await this.prisma.user.findFirst({ where: { id } });

      if (!currentUser) {
        return apiResponse(404, 'User not found', null);
      }

      const deletedUser = this.prisma.user.delete({
        where: { id },
      });
      return apiResponse(
        HttpStatusCode.OK,
        'Deleted user success',
        deletedUser,
      );
    } catch (error) {
      return apiError(error);
    }
  }
}
