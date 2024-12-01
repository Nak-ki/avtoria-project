import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString, Length, Min } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseCarReqDto {
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  brand: string;

  @IsString()
  @Length(2, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  model: string;

  @IsNumber()
  @Min(100)
  @Type(() => Number)
  price: string;

  @IsString()
  @Length(3, 10)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  currency: string;

  @IsString()
  @Length(4)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  year: string;

  @IsString()
  @Length(3, 20)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  region: string;
}
