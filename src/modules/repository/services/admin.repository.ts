import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdminEntity } from '../../../database/entities/admin.entity';

@Injectable()
export class AdminRepository extends Repository<AdminEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdminEntity, dataSource.manager);
  }
}
