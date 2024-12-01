import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseAdminReqDto } from '../../../../users/admin/dto/req/base-admin.req.dto';
import { BaseUserReqDto } from '../../../../users/user/dto/req/base-user.req.dto';

export class BaseAuthReqDto extends PickType(BaseUserReqDto, [
  'email',
  'password',
  'phone',
  'name',
]) {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}

export class BaseAuthForAdminReqDto extends PickType(BaseAdminReqDto, [
  'email',
  'password',
  'name',
]) {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}
