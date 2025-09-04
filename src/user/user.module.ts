import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileuploadService } from 'src/fileupload/fileupload.service';

@Module({
  imports: [FileuploadService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
