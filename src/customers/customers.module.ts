import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { FileuploadService } from 'src/fileupload/fileupload.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, FileuploadService],
})
export class CustomersModule {}
