import { Column, Entity } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.BRANDS })
export class BrandEntity extends BaseModel {
  @Column('text')
  brand: string;
}
