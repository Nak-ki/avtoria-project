import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarEntity } from '../../../database/entities/car.entity';
import { ListCarQueryDto } from '../../cars/dto/req/list-car-query.dto';

@Injectable()
export class CarRepository extends Repository<CarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarEntity, dataSource.manager);
  }

  public async findAll(query: ListCarQueryDto): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('car');
    if (query.search) {
      qb.andWhere('CONCAT(car.model, car.brand) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async findCarById(carId: string): Promise<CarEntity> {
    const qb = this.createQueryBuilder('car');
    qb.leftJoinAndSelect('car.user', 'user');

    qb.where('car.id = :carId');
    qb.setParameter('carId', carId);

    return await qb.getOne();
  }
}
