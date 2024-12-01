import { Module } from '@nestjs/common';

import { FileStorageModule } from '../../file-storage/file-storage.module';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';

@Module({
  imports: [FileStorageModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
