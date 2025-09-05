import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return await this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.warehouseService.findAll(+page, +limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.warehouseService.findOne(+id);
  }

  @Get('/staffs/:id')
  async findOneWithStaff(@Param('id') id: string) {
    return await this.warehouseService.findOneWithStaff(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return await this.warehouseService.update(+id, updateWarehouseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.warehouseService.remove(+id);
  }

  @Post('/assign-manager')
  async assignWarehouseManager(
    @Query('user_id') user_id: string,
    @Query('warehouse_id') warehouse_id: number,
  ) {
    return await this.warehouseService.assignWarehouseManager(
      user_id,
      +warehouse_id,
    );
  }

  @Post('/assign-staffs')
  async assignWarehouseStaff(
    @Query('user_id') user_id: string,
    @Query('warehouse_id') warehouse_id: number,
  ) {
    return await this.warehouseService.assignWarehouseStaff(
      user_id,
      +warehouse_id,
    );
  }
}
