import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { AdminRepository } from '../../repository/services/admin.repository';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AdminMapper } from '../../users/admin/services/admin.mapper';
import { AdminService } from '../../users/admin/services/admin.service';
import { ManagerMapper } from '../../users/manager/services/manager.mapper';
import { ManagerService } from '../../users/manager/services/manager.service';
import { UserMapper } from '../../users/user/services/user.mapper';
import { SignInReqDto } from '../models/dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../models/dto/req/sign-up.req.dto';
import {
  AuthAdminResDto,
  AuthManagerResDto,
  AuthResDto,
} from '../models/dto/res/auth.res.dto';
import { TokenPairResDto } from '../models/dto/res/token-pair.res.dto';
import { IUserData } from '../models/interfaces/user-data.interface';
import { AuthCacheService } from './auth-cache.sevice';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authCacheService: AuthCacheService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly adminRepository: AdminRepository,
    private readonly managerRepository: ManagerRepository,
    private readonly adminService: AdminService,
    private readonly managerService: ManagerService,
  ) {}

  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.isEmailNotExistOrThrow(dto.email);
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
      email: dto.email,
      role: user.role,
    });
    await Promise.all([
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        dto.deviceId,
      ),
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          deviceId: dto.deviceId,
          refreshToken: tokens.refreshToken,
        }),
      ),
    ]);

    return { user: UserMapper.toResponseDTO(user), tokens };
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true, role: true },
    });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isCompare = await bcrypt.compare(dto.password, user.password);
    if (!isCompare) {
      throw new UnauthorizedException();
    }
    await this.refreshTokenRepository.delete({
      user_id: user.id,
      deviceId: dto.deviceId,
    });
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
      role: user.role,
      email: dto.email,
    });
    await Promise.all([
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        dto.deviceId,
      ),
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          deviceId: dto.deviceId,
          refreshToken: tokens.refreshToken,
        }),
      ),
    ]);

    const userEntity = await this.userRepository.findOneBy({ id: user.id });

    return { user: UserMapper.toResponseDTO(userEntity), tokens };
  }

  public async signOut(userData: IUserData): Promise<void> {
    if (userData.role === UserRoleEnum.USER) {
      await Promise.all([
        this.authCacheService.deleteToken(userData.userId, userData.deviceId),
        this.refreshTokenRepository.delete({
          user_id: userData.userId,
          deviceId: userData.deviceId,
        }),
      ]);
    }
    if (userData.role === UserRoleEnum.MANAGER) {
      await Promise.all([
        this.authCacheService.deleteToken(userData.userId, userData.deviceId),
        this.refreshTokenRepository.delete({
          manager_id: userData.userId,
          deviceId: userData.deviceId,
        }),
      ]);
    }
    if (userData.role === UserRoleEnum.ADMIN) {
      await Promise.all([
        this.authCacheService.deleteToken(userData.userId, userData.deviceId),
        this.refreshTokenRepository.delete({
          admin_id: userData.userId,
          deviceId: userData.deviceId,
        }),
      ]);
    }
  }

  public async singUpAdmin(dto: SignUpReqDto): Promise<AuthAdminResDto> {
    await this.adminService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);
    const admin = await this.adminRepository.save(
      this.adminRepository.create({ ...dto, password }),
    );
    const pair = await this.tokenService.generateAuthTokens({
      userId: admin.id,
      deviceId: dto.deviceId,
      role: admin.role,
      email: dto.email,
    });
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          admin_id: admin.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, admin.id, dto.deviceId),
    ]);
    return AdminMapper.toResponseAdminDTO(admin, pair);
  }

  public async singInAdmin(dto: SignInReqDto): Promise<AuthAdminResDto> {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true, role: true },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const pair = await this.tokenService.generateAuthTokens({
      userId: admin.id,
      deviceId: dto.deviceId,
      role: admin.role,
      email: dto.email,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        admin_id: admin.id,
      }),
      this.authCacheService.deleteToken(admin.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          admin_id: admin.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, admin.id, dto.deviceId),
    ]);
    const adminEntity = await this.adminRepository.findOneBy({ id: admin.id });
    return AdminMapper.toResponseAdminDTO(adminEntity, pair);
  }

  public async singUpManager(dto: SignUpReqDto): Promise<AuthManagerResDto> {
    await this.managerService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);
    const manager = await this.managerRepository.save(
      this.managerRepository.create({ ...dto, password }),
    );
    const pair = await this.tokenService.generateAuthTokens({
      userId: manager.id,
      deviceId: dto.deviceId,
      role: manager.role,
      email: dto.email,
    });
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          manager_id: manager.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(
        pair.accessToken,
        manager.id,
        dto.deviceId,
      ),
    ]);
    return ManagerMapper.toResponseManagerDTO(manager, pair);
  }

  public async singInManager(dto: SignInReqDto): Promise<AuthManagerResDto> {
    const manager = await this.managerRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true, role: true },
    });
    if (!manager) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      manager.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const pair = await this.tokenService.generateAuthTokens({
      userId: manager.id,
      deviceId: dto.deviceId,
      role: manager.role,
      email: dto.email,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        manager_id: manager.id,
      }),
      this.authCacheService.deleteToken(manager.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          manager_id: manager.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(
        pair.accessToken,
        manager.id,
        dto.deviceId,
      ),
    ]);
    const managerEntity = await this.managerRepository.findOneBy({
      id: manager.id,
    });
    return ManagerMapper.toResponseManagerDTO(managerEntity, pair);
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    console.log(userData);
    const tokens = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
      role: userData.role,
      email: userData.email,
    });
    if (userData.role === UserRoleEnum.USER) {
      await Promise.all([
        this.authCacheService.deleteToken(userData.userId, userData.deviceId),
        this.refreshTokenRepository.delete({
          user_id: userData.userId,
          deviceId: userData.deviceId,
        }),
      ]);
      await Promise.all([
        this.authCacheService.saveToken(
          tokens.accessToken,
          userData.userId,
          userData.deviceId,
        ),
        this.refreshTokenRepository.save(
          this.refreshTokenRepository.create({
            user_id: userData.userId,
            deviceId: userData.deviceId,
            refreshToken: tokens.refreshToken,
          }),
        ),
      ]);
    }
    if (userData.role === UserRoleEnum.MANAGER) {
      await Promise.all([
        this.authCacheService.deleteToken(userData.userId, userData.deviceId),
        this.refreshTokenRepository.delete({
          manager_id: userData.userId,
          deviceId: userData.deviceId,
        }),
      ]);
      await Promise.all([
        this.authCacheService.saveToken(
          tokens.accessToken,
          userData.userId,
          userData.deviceId,
        ),
        this.refreshTokenRepository.save(
          this.refreshTokenRepository.create({
            manager_id: userData.userId,
            deviceId: userData.deviceId,
            refreshToken: tokens.refreshToken,
          }),
        ),
      ]);
    }
    if (userData.role === UserRoleEnum.ADMIN) {
      await Promise.all([
        this.authCacheService.deleteToken(userData.userId, userData.deviceId),
        this.refreshTokenRepository.delete({
          admin_id: userData.userId,
          deviceId: userData.deviceId,
        }),
      ]);
      await Promise.all([
        this.authCacheService.saveToken(
          tokens.accessToken,
          userData.userId,
          userData.deviceId,
        ),
        this.refreshTokenRepository.save(
          this.refreshTokenRepository.create({
            admin_id: userData.userId,
            deviceId: userData.deviceId,
            refreshToken: tokens.refreshToken,
          }),
        ),
      ]);
    }
    return tokens;
  }

  private async isEmailNotExistOrThrow(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new Error('Email already exists');
    }
  }
}
