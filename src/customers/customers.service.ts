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
    if (!filter.limit) filter.limit = 20;
    // case user provide but query() treat as string
    filter.page = +filter.page;
    filter.limit = +filter.limit;
    filter.province_id = +filter.province_id;

    const skip = (filter.page - 1) * filter.limit;
    const where: Prisma.CustomerWhereInput = {};
    const andConditions: Prisma.CustomerWhereInput[] = [];

    if (filter.name) {
      andConditions.push({
        name: { contains: filter.name, mode: 'insensitive' },
      });
    }

    if (filter.phone_number) {
      andConditions.push({
        phone: { contains: filter.phone_number },
      });
    }

    if (filter.district_id) {
      andConditions.push({
        province: {
          district: {
            some: { id: filter.district_id },
          },
        },
      });
    }

    if (filter.province_id) {
      andConditions.push({
        province: {
          district: {
            some: { id: filter.district_id },
          },
        },
      });
    }

    if (filter.type) {
      andConditions.push({
        type: { equals: filter.type },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        skip,
        take: filter.limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          province: true,
        },
      }),
      this.prisma.customer.count({ where }),
    ]);
    const current_total = customers.length;
    const lastPage = Math.ceil(total / filter.limit);
    const meta = {
      customers,
      total,
      lastPage,
      current_total,
    };
    return apiResponse(HttpStatusCode.OK, 'Success', meta);
  }

  // get percentage compare last and current month
  private percentChange(current: number, last: number): number {
    if (last === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - last) / last) * 100);
  }
  // get type of customer ( retail...)
  async getCustomerSummary() {
    try {
      // 📅 date ranges
      const startOfCurrentMonth = new Date();
      startOfCurrentMonth.setDate(1);

      const startOfLastMonth = new Date(startOfCurrentMonth);
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

      const endOfLastMonth = new Date(startOfCurrentMonth);
      endOfLastMonth.setDate(0); // last day of previous month

      // current month counts
      const [current_total, current_retails, current_wholesale, current_both] =
        await this.prisma.$transaction([
          this.prisma.customer.count({
            where: { createdAt: { gte: startOfCurrentMonth } },
          }),
          this.prisma.customer.count({
            where: { type: 'RETAILS', createdAt: { gte: startOfCurrentMonth } },
          }),
          this.prisma.customer.count({
            where: {
              type: 'WHOLESALE',
              createdAt: { gte: startOfCurrentMonth },
            },
          }),
          this.prisma.customer.count({
            where: { type: 'VIP', createdAt: { gte: startOfCurrentMonth } },
          }),
        ]);

      // last month counts
      const [lastTotal, lastRetails, lastWholesale, lastBoth] =
        await this.prisma.$transaction([
          this.prisma.customer.count({
            where: {
              createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            },
          }),
          this.prisma.customer.count({
            where: {
              type: 'RETAILS',
              createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            },
          }),
          this.prisma.customer.count({
            where: {
              type: 'WHOLESALE',
              createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            },
          }),
          this.prisma.customer.count({
            where: {
              type: 'VIP',
              createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            },
          }),
        ]);

      // all month counts
      const [total, retails, wholesale, both] = await this.prisma.$transaction([
        this.prisma.customer.count(),
        this.prisma.customer.count({
          where: { type: 'RETAILS' },
        }),
        this.prisma.customer.count({
          where: { type: 'WHOLESALE' },
        }),
        this.prisma.customer.count({
          where: { type: 'VIP' },
        }),
      ]);

      return apiResponse(200, 'Customer summary', {
        total,
        retails,
        wholesale,
        both,
        percentChanges: {
          total: this.percentChange(current_total, lastTotal),
          retails: this.percentChange(current_retails, lastRetails),
          wholesale: this.percentChange(current_wholesale, lastWholesale),
          both: this.percentChange(current_both, lastBoth),
        },
      });
    } catch (error) {
      return apiError(error);
    }
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
          province: {
            include: {
              district: true,
            },
          },
        },
      });
      return apiResponse(HttpStatusCode.OK, 'Success', customer);
    } catch (error) {
      return apiError(error);
    }
  }

  async customerDetails(id: string) {
    try {
      await this.getCustomerById(id);
      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
          province: {
            select: { name: true },
            include: {
              district: true,
            },
          },
          createdBy: {
            select: {
              name: true,
              role: true,
              email: true,
              img_url: true,
              phone: true,
              createdAt: true,
            },
          },
          updatedBy: {
            select: {
              name: true,
              role: true,
              email: true,
              img_url: true,
              phone: true,
              updatedAt: true,
            },
          },
          sales: true,
        },
      });
      return apiResponse(HttpStatusCode.OK, 'Customer details', customer);
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
