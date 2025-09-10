import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponseType } from 'src/common/constant/response-type';
import { HttpStatusCode } from 'src/enum/http-status';
import { apiError } from 'src/common/helpers/apiError';
import apiResponse from 'src/common/helpers/apiResponse';
import { FileuploadService } from 'src/fileupload/fileupload.service';
import { AllowImageType, FilePath } from 'src/enum/fileupload.enum';
import { FindAllCustomer } from './customer.interface';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUpload: FileuploadService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<apiResponseType> {
    try {
      // if photo exist than upload
      if (createCustomerDto.file) {
        // check if file is valid
        this.fileUpload.validateFile(
          createCustomerDto.file,
          AllowImageType,
          1, // limit file <= 1 MB
        );
        createCustomerDto.img_url = await this.fileUpload.uploadFile(
          createCustomerDto.file,
          FilePath.CUSTOMERS,
        );
        //remove file property before saving
        delete createCustomerDto.file;
      }
      const customer = await this.prisma.customer.create({
        data: createCustomerDto,
      });
      return apiResponse(HttpStatusCode.CREATED, 'Customer Created', customer);
    } catch (error: unknown) {
      return apiError(error);
    }
  }

  async findAll(filter: FindAllCustomer) {
    // default value case user don't provide
    if (!filter.page) filter.page = 1;
    if (!filter.limit) filter.limit = 30;
    // case user provide but query() treat as string
    filter.page = +filter.page;
    filter.limit = +filter.limit;

    const skip = (filter.page - 1) * filter.limit;
    const where: Prisma.CustomerWhereInput = {};
    const orConditions: Prisma.CustomerWhereInput[] = [];

    if (filter.name) {
      orConditions.push({
        name: { contains: filter.name, mode: 'insensitive' },
      });
    }

    if (filter.phone_number) {
      orConditions.push({
        phone: { contains: filter.phone_number },
      });
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }
    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        skip,
        take: filter.limit,
        where,
        orderBy: { createdAt: 'desc' }, // optional
        include: {
          district: {
            include: {
              province: true,
            },
          },
        },
      }),
      this.prisma.customer.count(),
    ]);
    const lastPage = Math.ceil(total / filter.limit);
    const meta = {
      customers,
      total,
      lastPage,
    };
    return apiResponse(HttpStatusCode.OK, 'Success', meta);
  }

  private async getCustomerById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async findOne(id: string) {
    try {
      await this.getCustomerById(id);
      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
          district: {
            include: {
              province: true,
            },
          },
        },
      });
      return apiResponse(HttpStatusCode.OK, 'Success', customer);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const currentCustomer = await this.getCustomerById(id);
      // if photo exist than upload
      if (updateCustomerDto.file) {
        // check if file is valid
        this.fileUpload.validateFile(
          updateCustomerDto.file,
          AllowImageType,
          1, // limit file <= 1 MB
        );
        updateCustomerDto.img_url = await this.fileUpload.replaceFile(
          currentCustomer?.img_url ?? null,
          updateCustomerDto.file,
          FilePath.CUSTOMERS,
        );
        //remove file property before saving
        delete updateCustomerDto.file;
      }

      if (!currentCustomer) {
        throw new NotFoundException('Customer not found');
      }

      const updatedCustomer = await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      });
      return apiResponse(
        HttpStatusCode.OK,
        'Updated customer success',
        updatedCustomer,
      );
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.getCustomerById(id);

      await this.prisma.customer.delete({
        where: { id },
      });
      return apiResponse(HttpStatusCode.OK, 'Deleted customer success');
    } catch (error) {
      return apiError(error);
    }
  }
}
