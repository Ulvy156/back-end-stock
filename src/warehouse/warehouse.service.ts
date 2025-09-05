import { Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponseType } from 'src/common/constant/response-type';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/enum/http-status';
import { apiError } from 'src/common/helpers/apiError';
import { RoleEnum } from 'generated/prisma';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) { }

  async create(
    createWarehouseDto: CreateWarehouseDto,
  ): Promise<apiResponseType> {
    try {
      const warehouse = await this.prisma.warehouse.create({
        data: createWarehouseDto,
      });
      return apiResponse(
        HttpStatusCode.CREATED,
        'Warehouse created',
        warehouse,
      );
    } catch (error: unknown) {
      return apiError(error);
    }
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [warehouse, total] = await this.prisma.$transaction([
      this.prisma.warehouse.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // optional
      }),
      this.prisma.warehouse.count(),
    ]);
    const lastPage = Math.ceil(total / limit);
    const meta = {
      warehouse,
      total,
      lastPage,
    };
    return apiResponse(HttpStatusCode.OK, 'Success', meta);
  }

  async findOne(id: number) {
    try {
      const warehouse = await this.prisma.warehouse.findFirst({
        where: { id },
      });
      if (!warehouse) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'Warehouse not found');
      }
      return apiResponse(HttpStatusCode.CREATED, 'Warehouse', warehouse);
    } catch (error) {
      return apiError(error);
    }
  }

  async findOneWithStaff(id: number) {
    try {
      const warehouse = await this.prisma.warehouse.findFirst({
        where: { id },
        include: {
          users: true,
        },
      });
      if (!warehouse) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'Warehouse not found');
      }
      return apiResponse(HttpStatusCode.CREATED, 'Warehouse', warehouse);
    } catch (error) {
      return apiError(error);
    }
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    try {
      const currentWarehouse = await this.prisma.warehouse.findFirst({
        where: { id },
      });

      if (!currentWarehouse) {
        return apiResponse(404, 'Warehouse not found', null);
      }

      const updatedWarehouse = await this.prisma.warehouse.update({
        where: { id },
        data: updateWarehouseDto,
      });
      return apiResponse(
        HttpStatusCode.OK,
        'Updated warehouse success',
        updatedWarehouse,
      );
    } catch (error) {
      return apiError(error);
    }
  }

  async remove(id: number) {
    try {
      const currentWarehouse = await this.prisma.warehouse.findFirst({
        where: { id },
      });

      if (!currentWarehouse) {
        return apiResponse(404, 'Warehouse not found', null);
      }

      const deletedWarehouse = this.prisma.warehouse.delete({
        where: { id },
      });
      return apiResponse(
        HttpStatusCode.OK,
        'Deleted Warehouse success',
        deletedWarehouse,
      );
    } catch (error) {
      return apiError(error);
    }
  }

  async assignWarehouseManager(
    user_id: string,
    warehouse_id: number,
  ): Promise<apiResponseType> {
    try {
      const user = await this.prisma.user.findFirst({ where: { id: user_id } });
      if (!user) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'User not found');
      }
      // if user is not warehouse manager
      if (user.role !== RoleEnum.WAREHOUSE_MANAGER) {
        return apiResponse(
          HttpStatusCode.BAD_REQUEST,
          'Only user has role WAREHOUSE MANAGER can be assigned',
        );
      }

      // check if warehouse exist
      const warehouse = await this.prisma.warehouse.findFirst({
        where: { id: warehouse_id },
      });
      if (!warehouse) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'Warehouse not found');
      }

      // check if already has manager
      const hasManager = await this.prisma.warehouse.findFirst({
        where: { id: warehouse_id },
        include: {
          users: {
            where: {
              role: RoleEnum.WAREHOUSE_MANAGER,
            },
          },
        },
      });
      if (hasManager && hasManager.users.length > 0) {
        return apiResponse(
          HttpStatusCode.NOT_FOUND,
          'Warehouse already has manager',
          hasManager,
        );
      }

      //create warehouse
      const userWarehouse = await this.prisma.user.update({
        data: {
          warehouse_id,
        },
        where: {
          id: user_id,
        },
      });
      return apiResponse(
        HttpStatusCode.CREATED,
        'Warehouse created',
        userWarehouse,
      );
    } catch (error: unknown) {
      return apiError(error);
    }
  }

  async assignWarehouseStaff(
    user_id: string,
    warehouse_id: number,
  ): Promise<apiResponseType> {
    try {
      const user = await this.prisma.user.findFirst({ where: { id: user_id } });
      if (!user) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'User not found');
      }
      // if user is not warehouse manager
      if (user.role === RoleEnum.WAREHOUSE_MANAGER) {
        return apiResponse(
          HttpStatusCode.BAD_REQUEST,
          'User has role WAREHOUSE MANAGER can not be assigned',
        );
      }

      // check if warehouse exist
      const warehouse = await this.prisma.warehouse.findFirst({
        where: { id: warehouse_id },
      });
      if (!warehouse) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'Warehouse not found');
      }

      //create warehouse
      const userWarehouse = await this.prisma.user.update({
        data: {
          warehouse_id,
        },
        where: {
          id: user_id,
        },
      });
      return apiResponse(
        HttpStatusCode.CREATED,
        'Warehouse created',
        userWarehouse,
      );
    } catch (error: unknown) {
      return apiError(error);
    }
  }
}
