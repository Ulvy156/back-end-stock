import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  telegram: string;

  @IsNumber()
  provinceId: number;

  @IsUrl()
  @IsOptional()
  mapUrl: string;

  @IsOptional()
  img_url?: string;
}
