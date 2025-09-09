import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProvinceService } from './province.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  async create(@Body() createProvinceDto: CreateProvinceDto) {
    return await this.provinceService.create(createProvinceDto);
  }

  @Get()
  async findAll() {
    return await this.provinceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.provinceService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProvinceDto: UpdateProvinceDto,
  ) {
    return await this.provinceService.update(+id, updateProvinceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.provinceService.remove(+id);
  }
}
