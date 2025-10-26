import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Injectable } from '@nestjs/common';
import { apiError } from 'src/common/helpers/apiError';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/enum/http-status';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Injectable()
export class RolePermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE ROLE SECTION
  async getAllRoles() {
    try {
      const roles = await this.prisma.role.findMany();
      return apiResponse(HttpStatusCode.CREATED, 'Roles data', roles);
    } catch (error) {
      return apiError(error);
    }
  }

  async getRoleWithPermissionsById(id: number) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
        include: {
          permissions: true,
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Role data', role);
    } catch (error) {
      return apiError(error);
    }
  }

  async createRole(role: CreateRoleDto) {
    try {
      await this.prisma.role.create({
        data: {
          name: role.name,
          description: role.name,
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Role Created');
    } catch (error) {
      return apiError(error);
    }
  }

  async updateRole(id: number, updateData: UpdateRoleDto) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
      });

      if (!role) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'Role Not Found');
      }

      await this.prisma.role.update({
        where: { id },
        data: {
          name: updateData.name,
          description: updateData.name,
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Role Updated');
    } catch (error) {
      return apiError(error);
    }
  }
  // soft delete
  async removeRoleById(id: number) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
      });

      if (!role) {
        return apiResponse(HttpStatusCode.NOT_FOUND, 'Role Not Found');
      }

      await this.prisma.role.update({
        where: { id },
        data: {
          is_deleted: true,
          deleted_at: new Date(),
        },
      });
      return apiResponse(HttpStatusCode.CREATED, 'Role Removed');
    } catch (error) {
      return apiError(error);
    }
  }
  // END CREATE ROLE SECTION

  // CREATE ROLE-PERMISSION SECTION
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
  // END CREATE PERMISSION SECTION

  // CREATE PERMISSION SECTION
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
  // END CREATE Role-Permission SECTION
}
