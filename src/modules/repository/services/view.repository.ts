import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TimeHelper } from '../../../common/helpers/time.helper';
import { ViewEntity } from '../../../database/entities/view.entity';

@Injectable()
export class ViewRepository extends Repository<ViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ViewEntity, dataSource.manager);
  }
  public async getByWeek(carId: string): Promise<number> {
    const qb = this.createQueryBuilder('view');
    qb.leftJoin('view.car', 'car');

    qb.andWhere('view.car_id = :carId AND view.created >= :time', {
      carId: carId,
      time: TimeHelper.subtractByParams(1, 'week'),
    });

    return await qb.getCount();
  }
  public async getByMonth(carId: string): Promise<number> {
    const qb = this.createQueryBuilder('view');
    qb.leftJoin('view.car', 'car');

    qb.andWhere('view.car_id = :carId AND view.created >= :time', {
      carId: carId,
      time: TimeHelper.subtractByParams(1, 'month'),
    });

    return await qb.getCount();
  }
  public async getByYear(carId: string): Promise<number> {
    const qb = this.createQueryBuilder('view');
    qb.leftJoin('view.car', 'car');

    qb.andWhere('view.car_id = :carId AND view.created >= :time', {
      carId: carId,
      time: TimeHelper.subtractByParams(1, 'year'),
    });

    return await qb.getCount();
  }
}
