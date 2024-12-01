import { PickType } from '@nestjs/swagger';

import { BaseAdminResDto } from './base-admin.res.dto';

export class AdminResDto extends PickType(BaseAdminResDto, [
  'id',
  'name',
  'email',
  'image',
]) {}
