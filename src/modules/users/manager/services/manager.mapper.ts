import * as process from 'node:process';

import { ManagerEntity } from '../../../../database/entities/manager.entity';
import { AuthManagerResDto } from '../../../auth/models/dto/res/auth.res.dto';
import { ITokenPair } from '../../../auth/models/interfaces/token-pair.interface';
import { IUserData } from '../../../auth/models/interfaces/user-data.interface';
import { ManagerResDto } from '../dto/res/manager.res.dto';

export class ManagerMapper {
  public static toResponseDTO(user: ManagerEntity): ManagerResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
        ? `${process.env.AWS_S3_BUCKET_URL}/${user.image}`
        : null,
    };
  }
  public static toResponseManagerDTO(
    manager: ManagerEntity,
    tokenPair: ITokenPair,
  ): AuthManagerResDto {
    return {
      manager: ManagerMapper.toResponseDTO(manager),
      tokens: this.toResponseRefreshDTO(tokenPair),
    };
  }

  public static toResponseRefreshDTO(tokenPair: ITokenPair): ITokenPair {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  public static toManagerDataDTO(
    manager: ManagerEntity,
    deviceId: string,
  ): IUserData {
    return {
      role: manager.role,
      userId: manager.id,
      email: manager.email,
      deviceId,
    };
  }
}
