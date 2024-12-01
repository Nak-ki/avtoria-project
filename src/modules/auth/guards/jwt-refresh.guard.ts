import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { AdminRepository } from '../../repository/services/admin.repository';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AdminMapper } from '../../users/admin/services/admin.mapper';
import { ManagerMapper } from '../../users/manager/services/manager.mapper';
import { UserMapper } from '../../users/user/services/user.mapper';
import { TokenType } from '../models/enums/token-type.enum';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private adminRepository: AdminRepository,
    private managerRepository: ManagerRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }
    const isRefreshTokenExist =
      await this.refreshTokenRepository.isTokenExist(refreshToken);
    if (!isRefreshTokenExist) {
      throw new UnauthorizedException();
    }
    if (!isRefreshTokenExist) {
      throw new UnauthorizedException();
    }

    console.log(payload);
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
