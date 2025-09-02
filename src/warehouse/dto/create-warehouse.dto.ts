import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsUrl()
  @IsOptional()
  mapUrl?: string | null;
}
