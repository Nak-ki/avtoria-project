import { Global, Module } from '@nestjs/common';

import { AdminRepository } from './services/admin.repository';
import { BrandRepository } from './services/brand.repository';
import { CarRepository } from './services/car.repository';
import { ManagerRepository } from './services/manager.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';
import { ViewRepository } from './services/view.repository';

@Global()
@Module({
  providers: [
    UserRepository,
    AdminRepository,
    ManagerRepository,
    RefreshTokenRepository,
    CarRepository,
    BrandRepository,
    ViewRepository,
  ],

  exports: [
    UserRepository,
    AdminRepository,
    ManagerRepository,
    RefreshTokenRepository,
    CarRepository,
    BrandRepository,
    ViewRepository,
  ],
})
export class RepositoryModule {}
