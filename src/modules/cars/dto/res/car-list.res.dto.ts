import { ListCarQueryDto } from '../req/list-car-query.dto';
import { CarResDto } from './car.res.dto';

export class CarListResDto extends ListCarQueryDto {
  data: CarResDto[];
  total: number;
}
