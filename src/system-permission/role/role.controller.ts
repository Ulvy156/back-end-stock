import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.service.createRole(dto);
  }

  @Get()
  getAllRoles() {
    return this.service.getAllRoles();
  }

  @Get(':id')
  getRoleById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getRoleWithPermissionsById(id);
  }

  @Patch(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.service.updateRole(id, dto);
  }

  @Delete(':id')
  removeRole(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeRoleById(id);
  }
}
