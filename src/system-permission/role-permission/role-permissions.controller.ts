import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermissionsService } from './role-permissions.service';

@Controller('role-permission')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post()
  async createRolePermission(@Body() data: CreateRolePermissionDto) {
    return await this.rolePermissionsService.createRolePermission(data);
  }

  @Get()
  async getAllRolePermission() {
    return await this.rolePermissionsService.getAllRolePermission();
  }

  @Get(':id')
  getRolePermissionById(@Param('id') id: string) {
    return this.rolePermissionsService.getRolePermissionById(+id);
  }

  @Patch(':id')
  async updateRolePermission(
    @Param('id') id: string,
    @Body() data: UpdateRolePermissionDto,
  ) {
    return await this.rolePermissionsService.updateRolePermission(+id, data);
  }

  @Delete(':id')
  async removeRolePermissionById(@Param('id') id: string) {
    return await this.rolePermissionsService.removeRolePermissionById(+id);
  }
}
