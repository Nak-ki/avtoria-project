import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './common/filters/global-exeption.filter';
import configuration from './configs/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { CarModule } from './modules/cars/car.module';
import { CronModule } from './modules/crons/cron.module';
import { EmailModule } from './modules/emails/email.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { RedisModule } from './modules/redis/redis.module';
import { RepositoryModule } from './modules/repository/repositity.module';
import { AdminModule } from './modules/users/admin/admin.module';
import { ManagerModule } from './modules/users/manager/manager.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    ManagerModule,
    PostgresModule,
    RedisModule,
    LoggerModule,
    RepositoryModule,
    FileStorageModule,
    CronModule,
    CarModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
