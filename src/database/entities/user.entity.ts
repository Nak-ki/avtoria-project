import { Column, Entity, OneToMany } from 'typeorm';

import { AccountTypeEnum } from '../../common/enums/account-type.enum';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { CarEntity } from './car.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: TableNameEnum.USERS })
export class UserEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text', { unique: true })
  phone: string;

  @Column('enum', { enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Column('text', { nullable: true })
  image?: string;

  @Column('text', { default: false })
  isBanned: boolean;

  @Column('enum', { enum: AccountTypeEnum, default: AccountTypeEnum.BASE })
  account: AccountTypeEnum;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => CarEntity, (entity) => entity.user)
  cars?: CarEntity[];
}
