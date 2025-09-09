import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { FileuploadModule } from './fileupload/fileupload.module';
import { ProvinceModule } from './location/province/province.module';
import { DistrictModule } from './location/district/district.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PrismaModule,
    AuthModule,
    CustomersModule,
    WarehouseModule,
    FileuploadModule,
    ProvinceModule,
    DistrictModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
