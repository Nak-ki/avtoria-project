import { PickType } from '@nestjs/swagger';

import { TokenPairResDto } from '../../../../auth/models/dto/res/token-pair.res.dto';
import { BaseManagerResDto } from './base-manager.res.dto';

export class ManagerResDto extends PickType(BaseManagerResDto, [
  'id',
  'name',
  'email',
  'phone',
  'image',
]) {}
