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
import { BrandRepository } from '../../../repository/services/brand.repository';
import { ManagerRepository } from '../../../repository/services/manager.repository';
import { UserRepository } from '../../../repository/services/user.repository';
import { BrandReqDto } from '../../admin/dto/req/brand.req.dto';
import { UserRoleEnum } from '../../user/enums/user-role.enum';
import { ManagerResDto } from '../dto/res/manager.res.dto';
import { ManagerMapper } from './manager.mapper';

@Injectable()
export class ManagerService {
  constructor(
    private readonly logger: LoggerService,
    private readonly managerRepository: ManagerRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  public async getMe(userData: IUserData): Promise<ManagerResDto> {
    const user = await this.managerRepository.findOneBy({
      id: userData.userId,
    });
    return ManagerMapper.toResponseDTO(user);
  }

  public async getById(id: string): Promise<ManagerResDto> {
    const user = await this.managerRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return ManagerMapper.toResponseDTO(user);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.managerRepository.findOneBy({ email });
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
    await this.managerRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.managerRepository.findOneBy({
      id: userData.userId,
    });
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.managerRepository.save(
        this.managerRepository.merge(user, { image: null }),
      );
    }
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
