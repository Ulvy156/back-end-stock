import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  telegram: string;

  @IsString()
  address: string;

  @IsUrl()
  @IsOptional()
  mapUrl: string;

  @IsOptional()
  img_url?: string;
}
