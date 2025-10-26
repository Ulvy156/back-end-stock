import { Module } from '@nestjs/common';
import { PermissionsModule } from './permission/permissions.module';
import { RoleModule } from './role/role.module';
import { RolePermissionsModule } from './role-permission/role-permissions.module';

@Module({
  imports: [PermissionsModule, RoleModule, RolePermissionsModule],
})
export class SystemPermissionModule {}
