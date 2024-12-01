import { Module } from '@nestjs/common';

import { FileStorageModule } from '../file-storage/file-storage.module';
import { UserService } from './user/services/user.service';
import { UsersController } from './users.controller';

@Module({
  imports: [FileStorageModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
