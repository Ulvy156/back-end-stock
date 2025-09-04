import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/common/constant/http-status.constant';
import { apiError } from 'src/common/helpers/apiError';
import { apiResponseType } from 'src/common/constant/response-type';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'generated/prisma';
import { FileuploadService } from 'src/fileupload/fileupload.service';
import { FilePath } from 'src/enum/fileupload.enum';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUpload: FileuploadService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<apiResponseType> {
    try {
      // optional for warehouse id for admin only
      if (
        createUserDto.role !== RoleEnum.ADMIN &&
        !createUserDto.warehouse_id
      ) {
        throw new HttpException(
          `warehouse id is required for ${createUserDto.role} role`,
          HttpStatusCode.BAD_REQUEST,
        );
      }
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          role: createUserDto.role ?? RoleEnum.SELLER,
          password: hash, // use hashed password
        },
      });
      // if photo exist than upload
      if (createUserDto.file) {
        await this.fileUpload.uploadFile(
          createUserDto.file,
          FilePath.CUSTOMERS,
        );
      }
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
        throw new HttpException('User not found', HttpStatusCode.NOT_FOUND);
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
          warehouse: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatusCode.NOT_FOUND);
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
        throw new HttpException('User not found', HttpStatusCode.NOT_FOUND);
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
        throw new HttpException('User not found', HttpStatusCode.NOT_FOUND);
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
