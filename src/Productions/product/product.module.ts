import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FileuploadService } from 'src/fileupload/fileupload.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, FileuploadService],
})
export class ProductModule {}
