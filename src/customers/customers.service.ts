import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponseType } from 'src/common/constant/response-type';
import { HttpStatusCode } from 'src/enum/http-status';
import { apiError } from 'src/common/helpers/apiError';
import apiResponse from 'src/common/helpers/apiResponse';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<apiResponseType> {
    try {
      const customer = await this.prisma.customer.create({
        data: createCustomerDto,
      });
      return apiResponse(HttpStatusCode.CREATED, 'Customer Created', customer);
    } catch (error: unknown) {
      return apiError(error);
    }
  }

  async findAll(page: number, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // optional
      }),
      this.prisma.customer.count(),
    ]);
    const lastPage = Math.ceil(total / limit);
    const meta = {
      customers,
      total,
      lastPage,
    };
    return apiResponse(HttpStatusCode.OK, 'Success', meta);
  }

  async findOne(id: string) {
    try {
      const customer = await this.prisma.customer.findFirst({ where: { id } });

      if (!customer) {
        return apiResponse(404, 'Customer not found', null);
      }

      return apiResponse(HttpStatusCode.OK, 'Success', customer);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const currentCustomer = await this.prisma.customer.findFirst({
        where: { id },
      });

      if (!currentCustomer) {
        return apiResponse(404, 'Customer not found', null);
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
      const currentCustomer = await this.prisma.customer.findFirst({
        where: { id },
      });

      if (!currentCustomer) {
        return apiResponse(404, 'Customer not found', null);
      }

      const deletedCustomer = await this.prisma.customer.delete({
        where: { id },
      });
      return apiResponse(
        HttpStatusCode.OK,
        'Deleted customer success',
        deletedCustomer,
      );
    } catch (error) {
      return apiError(error);
    }
  }
}
