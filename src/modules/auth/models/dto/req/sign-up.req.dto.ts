import { PickType } from '@nestjs/swagger';

import { BaseAuthForAdminReqDto, BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
  'phone',
  'name',
  'deviceId',
]) {}

export class SignUpSitePersonReqDto extends PickType(BaseAuthForAdminReqDto, [
  'email',
  'password',
  'name',
  'deviceId',
]) {}
