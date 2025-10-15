import { IsNumber, IsString } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  name: string;

  @IsNumber()
  province_id: number;
}
