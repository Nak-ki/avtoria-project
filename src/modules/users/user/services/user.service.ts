import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AccountTypeEnum } from '../../../../common/enums/account-type.enum';
import { IUserData } from '../../../auth/models/interfaces/user-data.interface';
import { ContentType } from '../../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../../file-storage/services/file-storage.service';
import { LoggerService } from '../../../logger/logger.service';
import { UserRepository } from '../../../repository/services/user.repository';
import { UpdateUserReqDto } from '../dto/req/update-user.req.dto';
import { UserResDto } from '../dto/res/user.res.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly fileStorageService: FileStorageService,
  ) {}

  public async getMe(userData: IUserData): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    return UserMapper.toResponseDTO(user);
  }

  public async updateMe(
    userData: IUserData,
    updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const updateUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
    return UserMapper.toResponseDTO(updateUser);
  }

  public async removeMe(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    await this.userRepository.remove(user);
  }

  public async getById(id: string): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toResponseDTO(user);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }
  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    console.log(userData);
    const image = await this.fileStorageService.uploadFile(
      avatar,
      ContentType.AVATAR,
      userData.userId,
    );
    await this.userRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.userRepository.save(
        this.userRepository.merge(user, { image: null }),
      );
    }
  }

  public async updatePremium(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    await this.userRepository.update(user.id, {
      account: AccountTypeEnum.PREMIUM,
    });
  }
}
