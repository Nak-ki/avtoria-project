import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AdminEntity } from './admin.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { ManagerEntity } from './manager.entity';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.REFRESH_TOKENS })
export class RefreshTokenEntity extends BaseModel {
  @Column('text')
  refreshToken: string;

  @Column('text')
  deviceId: string;

  @Column({ nullable: true })
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ nullable: true })
  admin_id: string;
  @ManyToOne(() => AdminEntity, (entity) => entity.refreshTokens)
  @JoinColumn({ name: 'admin_id' })
  admin?: AdminEntity;

  @Column({ nullable: true })
  manager_id: string;
  @ManyToOne(() => ManagerEntity, (entity) => entity.refreshTokens)
  @JoinColumn({ name: 'manager_id' })
  manager?: AdminEntity;
}
