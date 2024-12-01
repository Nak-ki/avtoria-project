import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUserData } from '../../../auth/models/interfaces/user-data.interface';
import { ContentType } from '../../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../../file-storage/services/file-storage.service';
import { LoggerService } from '../../../logger/logger.service';
import { AdminRepository } from '../../../repository/services/admin.repository';
import { BrandRepository } from '../../../repository/services/brand.repository';
import { UserRepository } from '../../../repository/services/user.repository';
import { UserRoleEnum } from '../../user/enums/user-role.enum';
import { BrandReqDto } from '../dto/req/brand.req.dto';
import { AdminResDto } from '../dto/res/admin.res.dto';
import { AdminMapper } from './admin.mapper';

@Injectable()
export class AdminService {
  constructor(
    private readonly logger: LoggerService,
    private readonly adminRepository: AdminRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  public async getMe(userData: IUserData): Promise<AdminResDto> {
    const user = await this.adminRepository.findOneBy({ id: userData.userId });
    return AdminMapper.toResponseDTO(user);
  }

  public async banUser(userData: IUserData, userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    await this.userRepository.update(userId, { isBanned: true });
  }

  public async unbanUser(userData: IUserData, userId: string): Promise<void> {
    if (userData.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException();
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    await this.userRepository.update(userId, { isBanned: false });
  }

  public async removeMe(userData: IUserData): Promise<void> {
    const user = await this.adminRepository.findOneBy({ id: userData.userId });
    await this.adminRepository.remove(user);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.adminRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }
  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.fileStorageService.uploadFile(
      avatar,
      ContentType.AVATAR,
      userData.userId,
    );
    await this.adminRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.adminRepository.findOneBy({ id: userData.userId });
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.adminRepository.save(
        this.adminRepository.merge(user, { image: null }),
      );
    }
  }
  public async addBrandToList(
    userData: IUserData,
    dto: BrandReqDto,
  ): Promise<void> {
    if (userData.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException();
    }
    const isExist = await this.brandRepository.findOneBy({ brand: dto.brand });
    if (isExist) {
      throw new ConflictException();
    }
    await this.brandRepository.save(
      this.brandRepository.create({ brand: dto.brand }),
    );
  }
}
