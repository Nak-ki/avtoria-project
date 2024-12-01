import { PickType } from '@nestjs/swagger';

import { BaseCarResDto } from './base-car.res.dto';

export class CarResDto extends PickType(BaseCarResDto, [
  'id',
  'brand',
  'model',
  'region',
  'currency',
  'price',
  'totalPrice',
  'baseCurrency',
  'rate',
  'isActive',
  'image',
]) {}
