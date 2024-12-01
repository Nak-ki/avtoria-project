import { PickType } from '@nestjs/swagger';

import { BaseManagerReqDto } from './base-manager.req.dto';

export class UpdateManagerReqDto extends PickType(BaseManagerReqDto, [
  'image',
  'name',
]) {}
