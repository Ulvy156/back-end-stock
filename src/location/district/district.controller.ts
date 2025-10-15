import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Post()
  async create(@Body() createDistrictDto: CreateDistrictDto) {
    return await this.districtService.create(createDistrictDto);
  }

  @Get()
  async findAll() {
    return await this.districtService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.districtService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return await this.districtService.update(id, updateDistrictDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.districtService.remove(id);
  }
}
