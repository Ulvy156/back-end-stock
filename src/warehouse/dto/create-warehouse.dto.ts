import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { WarehouseType } from 'generated/prisma';

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsUrl()
  @IsOptional()
  mapUrl?: string | null;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  type: WarehouseType;

  @IsOptional()
  img_url?: string;
}
