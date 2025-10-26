import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { apiError } from 'src/common/helpers/apiError';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/enum/http-status';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE PERMISSION SECTION
  async getAllPermissions() {
    try {
      const permissions = await this.prisma.permission.findMany();
      return apiResponse(
        HttpStatusCode.CREATED,
        'Permissions data',
        permissions,
      );
    } catch (error) {
      return apiError(error);
    }
  }

  async getPermissionById(id: number) {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Permission data', permission);
    } catch (error) {
      return apiError(error);
    }
  }

  async createPermission(data: CreatePermissionDto) {
    try {
      await this.prisma.permission.create({
        data: {
          name: data.name,
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Permission Created');
    } catch (error) {
      return apiError(error);
    }
  }

  async updatePermission(id: number, data: UpdatePermissionDto) {
    try {
      const permissions = await this.prisma.permission.findUnique({
        where: { id },
      });

      if (!permissions) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'Permission Not Found');
      }

      await this.prisma.permission.update({
        where: { id },
        data: {
          name: data.name,
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Permission Updated');
    } catch (error) {
      return apiError(error);
    }
  }

  async removePermissionById(id: number) {
    try {
      const data = await this.prisma.permission.findUnique({
        where: { id },
      });

      if (!data) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'Permission Not Found');
      }

      await this.prisma.permission.update({
        where: { id },
        data: {
          is_deleted: true,
          deleted_at: new Date(),
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Permission Created');
    } catch (error) {
      return apiError(error);
    }
  }
}
