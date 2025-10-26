import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Controller('role')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  // CREATE ROLE SECTION
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolePermissionsService.createRole(createRoleDto);
  }

  @Get()
  async getAllRoles() {
    return await this.rolePermissionsService.getAllRoles();
  }

  @Get(':id')
  getRoleWithPermissionsById(@Param('id') id: string) {
    return this.rolePermissionsService.getRoleWithPermissionsById(+id);
  }

  @Patch(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.rolePermissionsService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  async removeRoleById(@Param('id') id: string) {
    return await this.rolePermissionsService.removeRoleById(+id);
  }
  // END CREATE ROLE SECTION

  // CREATE PERMISSIONS SECTION
  @Post('permission')
  async createPermission(@Body() data: CreatePermissionDto) {
    return await this.rolePermissionsService.createPermission(data);
  }

  @Get('permission')
  async getAllPermissions() {
    return await this.rolePermissionsService.getAllPermissions();
  }

  @Get('permission/:id')
  getPermissionById(@Param('id') id: string) {
    return this.rolePermissionsService.getPermissionById(+id);
  }

  @Patch('permission/:id')
  async updatePermission(
    @Param('id') id: string,
    @Body() data: UpdatePermissionDto,
  ) {
    return await this.rolePermissionsService.updatePermission(+id, data);
  }

  @Delete('permission/:id')
  async removePermissionById(@Param('id') id: string) {
    return await this.rolePermissionsService.removePermissionById(+id);
  }
  // END CREATE ROLE-PERMISSIONS SECTION

  // CREATE PERMISSIONS SECTION
  @Post('permission')
  async createRolePermission(@Body() data: CreateRolePermissionDto) {
    return await this.rolePermissionsService.createRolePermission(data);
  }

  @Get('permission')
  async getAllRolePermission() {
    return await this.rolePermissionsService.getAllRolePermission();
  }

  @Get('permission/:id')
  getRolePermissionById(@Param('id') id: string) {
    return this.rolePermissionsService.getRolePermissionById(+id);
  }

  @Patch('permission/:id')
  async updateRolePermission(
    @Param('id') id: string,
    @Body() data: UpdateRolePermissionDto,
  ) {
    return await this.rolePermissionsService.updateRolePermission(+id, data);
  }

  @Delete('permission/:id')
  async removeRolePermissionById(@Param('id') id: string) {
    return await this.rolePermissionsService.removeRolePermissionById(+id);
  }
  // END CREATE ROLE-PERMISSION SECTION
}
