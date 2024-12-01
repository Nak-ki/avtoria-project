import * as process from 'node:process';

import { CarEntity } from '../../../database/entities/car.entity';
import { ListCarQueryDto } from '../dto/req/list-car-query.dto';
import { CarResDto } from '../dto/res/car.res.dto';
import { CarListResDto } from '../dto/res/car-list.res.dto';

export class CarMapper {
  public static toResponseDTO(car: CarEntity): CarResDto {
    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      region: car.region,
      currency: car.currency,
      price: car.price,
      totalPrice: car.totalPrice,
      baseCurrency: car.baseCurrency,
      rate: car.rate ? car.rate : null,
      isActive: car.isActive,
      image: car.image ? `${process.env.AWS_S3_BUCKET_URL}/${car.image}` : null,
    };
  }
  public static toResDtoList(
    data: CarEntity[],
    total: number,
    query: ListCarQueryDto,
  ): CarListResDto {
    return { data: data.map(this.toResponseDTO), total, ...query };
  }
}
