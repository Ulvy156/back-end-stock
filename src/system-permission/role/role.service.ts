import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { apiError } from 'src/common/helpers/apiError';
import apiResponse from 'src/common/helpers/apiResponse';
import { HttpStatusCode } from 'src/enum/http-status';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

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
}
