import { Module } from '@nestjs/common';

import { FileStorageModule } from '../../file-storage/file-storage.module';
import { ManagerController } from './manager.controller';
import { ManagerService } from './services/manager.service';

@Module({
  imports: [FileStorageModule],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
