import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RoleEnum } from 'generated/prisma';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  warehouse_id?: number;

  @IsOptional()
  file?: Express.Multer.File;

  @IsOptional()
  img_url?: string;
}
