import { PartialType } from '@nestjs/mapped-types';
import { CreateProvinceDto } from './create-province.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {
  @IsNotEmpty()
  @IsString()
  name: string;
}
