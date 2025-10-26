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
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly service: PermissionsService) {}

  @Post()
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.service.createPermission(dto);
  }

  @Get()
  getAllPermissions() {
    return this.service.getAllPermissions();
  }

  @Get(':id')
  getPermissionById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getPermissionById(id);
  }

  @Patch(':id')
  updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.service.updatePermission(id, dto);
  }

  @Delete(':id')
  removePermission(@Param('id', ParseIntPipe) id: number) {
    return this.service.removePermissionById(id);
  }
}
