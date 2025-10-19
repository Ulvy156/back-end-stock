import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CustomerType } from 'generated/prisma';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  telegram: string;

  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  province_id: number;

  @IsString()
  @IsNotEmpty()
  district_id: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsUrl()
  @IsOptional()
  mapUrl: string;

  @IsOptional()
  img_url?: string;

  @IsString()
  created_by_user_id?: string;

  @IsOptional()
  file?: Express.Multer.File;
}
