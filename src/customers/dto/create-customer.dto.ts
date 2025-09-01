import { IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  telegram: string;

  @IsString()
  address: string;
}
