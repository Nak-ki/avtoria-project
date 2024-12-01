import { Column, Entity, OneToMany } from 'typeorm';

import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: TableNameEnum.MANAGER })
export class ManagerEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text', { unique: true, nullable: true })
  phone?: string;

  @Column('enum', { enum: UserRoleEnum, default: UserRoleEnum.MANAGER })
  role: UserRoleEnum;

  @Column('text', { nullable: true })
  image?: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.manager)
  refreshTokens?: RefreshTokenEntity[];
}
