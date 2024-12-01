import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CarEntity } from './car.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.VIEWS })
export class ViewEntity extends BaseModel {
  @Column()
  car_id: string;
  @ManyToOne(() => CarEntity, (entity) => entity.views)
  @JoinColumn({ name: 'car_id' })
  car?: CarEntity;
}
