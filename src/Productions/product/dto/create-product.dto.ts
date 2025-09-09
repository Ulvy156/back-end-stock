import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsString()
  unit: string;

  @IsNumber()
  cost_price: number;

  @IsNumber()
  selling_price: number;

  @IsString()
  category_id: string;
}
