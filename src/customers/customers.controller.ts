import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { FindAllCustomer } from './customer.interface';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createCustomerDto.file = file;
    }
    return await this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll(@Query() filter: FindAllCustomer) {
    return await this.customersService.findAll(filter);
  }

  @Get('/customer-summary')
  async getCustomerSummary() {
    return await this.customersService.getCustomerSummary();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.customersService.findOne(id);
  }

  @Get('/customer-details/:id')
  async customerDetails(@Param('id') id: string) {
    return await this.customersService.customerDetails(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateCustomerDto.file = file;
    }
    return await this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.customersService.remove(id);
  }
}
