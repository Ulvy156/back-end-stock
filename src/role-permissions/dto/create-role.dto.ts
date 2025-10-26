import { IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from 'generated/prisma';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: RoleEnum;

  @IsNotEmpty()
  @IsString()
  description: string;
}
