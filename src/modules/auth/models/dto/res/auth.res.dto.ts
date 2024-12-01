import { AdminResDto } from '../../../../users/admin/dto/res/admin.res.dto';
import { ManagerResDto } from '../../../../users/manager/dto/res/manager.res.dto';
import { UserResDto } from '../../../../users/user/dto/res/user.res.dto';
import { TokenPairResDto } from './token-pair.res.dto';

export class AuthResDto {
  user: UserResDto;
  tokens: TokenPairResDto;
}

export class AuthAdminResDto {
  admin: AdminResDto;
  tokens: TokenPairResDto;
}

export class AuthManagerResDto {
  manager: ManagerResDto;
  tokens: TokenPairResDto;
}
