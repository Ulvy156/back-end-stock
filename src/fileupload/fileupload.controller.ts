import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilePath } from './fileupload.type';

@Controller('fileupload')
export class FileuploadController {
  constructor(private readonly uploadService: FileuploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('subfolder') subfolder: FilePath,
  ) {
    const url = await this.uploadService.uploadFile(file, subfolder);
    return { url };
  }
}
