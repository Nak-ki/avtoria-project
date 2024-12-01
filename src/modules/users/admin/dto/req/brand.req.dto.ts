import { Transform, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class BrandReqDto {
  @IsString()
  @Length(2, 15)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  brand: string;
}
