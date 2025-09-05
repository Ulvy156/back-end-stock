import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileuploadService } from 'src/fileupload/fileupload.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, FileuploadService],
})
export class UserModule {}
