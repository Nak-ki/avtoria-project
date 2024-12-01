import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from '../redis/redis.module';
import { AdminModule } from '../users/admin/admin.module';
import { ManagerModule } from '../users/manager/manager.module';
import { UserModule } from '../users/user/user.module';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.sevice';
import { TokenService } from './services/token.service';

@Module({
  imports: [JwtModule, RedisModule, UserModule, AdminModule, ManagerModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    AuthService,
    AuthCacheService,
    TokenService,
    JwtRefreshGuard,
  ],
  exports: [],
})
export class AuthModule {}
