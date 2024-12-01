import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';
import { ViewEntity } from './view.entity';

@Entity({ name: TableNameEnum.CARS })
export class CarEntity extends BaseModel {
  @Column('text')
  brand: string;

  @Column('text')
  model: string;

  @Column('text')
  price: string;

  @Column('text', { nullable: true })
  totalPrice: string;

  @Column('text', { default: 'UAH' })
  baseCurrency: string;

  @Column('text')
  currency: string;

  @Column('text', { nullable: true })
  rate: string;

  @Column('text')
  year: string;

  @Column('text')
  region: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column('text', { default: false })
  isActive: boolean;

  @Column('text', { default: 0 })
  browsing: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => ViewEntity, (entity) => entity.car)
  views?: ViewEntity[];
}
