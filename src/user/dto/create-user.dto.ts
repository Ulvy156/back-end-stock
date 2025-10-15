import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsStrongPassword()
  password: string;

  @IsNumber()
  @Type(() => Number)
  roleId: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  warehouse_id: number;

  @IsOptional()
  file?: Express.Multer.File;

  @IsOptional()
  img_url?: string;
}
