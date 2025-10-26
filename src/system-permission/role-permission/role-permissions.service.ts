import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { apiError } from 'src/common/helpers/apiError';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/enum/http-status';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Injectable()
export class RolePermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRolePermission() {
    try {
      const rolePermission = await this.prisma.rolePermission.findMany();
      return apiResponse(
        HttpStatusCode.CREATED,
        'Role-Permission data',
        rolePermission,
      );
    } catch (error) {
      return apiError(error);
    }
  }

  async getRolePermissionById(id: number) {
    try {
      const rolePermission = await this.prisma.rolePermission.findUnique({
        where: { id },
      });
      return apiResponse(
        HttpStatusCode.CREATED,
        'Role-Permission data',
        rolePermission,
      );
    } catch (error) {
      return apiError(error);
    }
  }

  async createRolePermission(data: CreateRolePermissionDto) {
    try {
      await this.prisma.rolePermission.create({
        data: {
          roleId: data.roleId,
          permissionId: data.permissionId,
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Role-Permission Created');
    } catch (error) {
      return apiError(error);
    }
  }

  async updateRolePermission(id: number, data: UpdateRolePermissionDto) {
    try {
      const rolePermission = await this.prisma.rolePermission.findUnique({
        where: { id },
      });

      if (!rolePermission) {
        return apiResponse(
          HttpStatusCode.NOT_FOUND,
          'Role-Permission Not Found',
        );
      }

      await this.prisma.rolePermission.update({
        where: { id },
        data: {
          roleId: data.roleId,
          permissionId: data.permissionId,
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Permission Updated');
    } catch (error) {
      return apiError(error);
    }
  }
  async removeRolePermissionById(id: number) {
    try {
      const data = await this.prisma.rolePermission.findUnique({
        where: { id },
      });

      if (!data) {
        return apiResponse(
          HttpStatusCode.NOT_FOUND,
          'Role-Permission Not Found',
        );
      }

      await this.prisma.rolePermission.delete({
        where: { id },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Role-Permission Created');
    } catch (error) {
      return apiError(error);
    }
  }
}
