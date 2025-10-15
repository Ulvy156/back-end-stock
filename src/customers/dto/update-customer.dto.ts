import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  telegram: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsUrl()
  @IsOptional()
  mapUrl: string;

  @IsString()
  updated_by_user_id?: string;

  @IsString()
  province_id: number;

  @IsOptional()
  img_url?: string;

  @IsOptional()
  file?: Express.Multer.File;
}
