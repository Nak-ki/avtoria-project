import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { TokenType } from '../models/enums/token-type.enum';
import { AuthCacheService } from '../services/auth-cache.sevice';
import { TokenService } from '../services/token.service';

@Injectable()
export class AdminRightsGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }
    const isAccessTokenExist = await this.authCacheService.isAccessTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );
    if (!isAccessTokenExist) {
      throw new UnauthorizedException();
    }
    if (payload.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException();
    }
    return true;
  }
}
