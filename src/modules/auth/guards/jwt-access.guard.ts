import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { AdminRepository } from '../../repository/services/admin.repository';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AdminMapper } from '../../users/admin/services/admin.mapper';
import { ManagerMapper } from '../../users/manager/services/manager.mapper';
import { UserMapper } from '../../users/user/services/user.mapper';
import { SKIP_AUTH } from '../decorators/skip-auth.decorator';
import { TokenType } from '../models/enums/token-type.enum';
import { AuthCacheService } from '../services/auth-cache.sevice';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private adminRepository: AdminRepository,
    private managerRepository: ManagerRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipAuth) return true;

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
    switch (payload.role) {
      case UserRoleEnum.USER:
        const user = await this.userRepository.findOneBy({
          id: payload.userId,
        });
        if (!user) {
          throw new UnauthorizedException();
        }
        request.user = UserMapper.toUserDataDTO(user, payload.deviceId);
        break;
      case UserRoleEnum.MANAGER:
        const manager = await this.managerRepository.findOneBy({
          id: payload.userId,
        });
        if (!manager) {
          throw new UnauthorizedException();
        }
        request.user = ManagerMapper.toManagerDataDTO(
          manager,
          payload.deviceId,
        );
        break;
      case UserRoleEnum.ADMIN:
        const admin = await this.adminRepository.findOneBy({
          id: payload.userId,
        });
        if (!admin) {
          throw new UnauthorizedException();
        }
        request.user = AdminMapper.toAdminDataDTO(admin, payload.deviceId);
    }
    return true;
  }
}
