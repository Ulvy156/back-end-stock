import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/enum/http-status';
import { apiError } from 'src/common/helpers/apiError';
import { apiResponseType } from 'src/common/constant/response-type';
import * as bcrypt from 'bcrypt';
import { FileuploadService } from 'src/fileupload/fileupload.service';
import { FilePath, FileType } from 'src/enum/fileupload.enum';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUpload: FileuploadService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<apiResponseType> {
    try {
      // if photo exist than upload
      if (createUserDto.file) {
        // check if file is valid
        this.fileUpload.validateFile(
          createUserDto.file,
          [FileType.PNG, FileType.JPEG, FileType.JPEG],
          1, // limit file <= 1 MB
        );
        createUserDto.img_url = await this.fileUpload.uploadFile(
          createUserDto.file,
          FilePath.USERS,
        );
        //remove file property before saving
        delete createUserDto.file;
      }
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          roleId: createUserDto.roleId,
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

  private async getUserById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findOne(id: string): Promise<apiResponseType> {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { id },
        include: {
          role: true,
        },
      });
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
        throw new NotFoundException('User not found');
      }

      return apiResponse(HttpStatusCode.OK, 'Success', user);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.getUserById(id);
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
