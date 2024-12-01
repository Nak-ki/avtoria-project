import * as process from 'node:process';

import { AdminEntity } from '../../../../database/entities/admin.entity';
import { AuthAdminResDto } from '../../../auth/models/dto/res/auth.res.dto';
import { ITokenPair } from '../../../auth/models/interfaces/token-pair.interface';
import { IUserData } from '../../../auth/models/interfaces/user-data.interface';
import { AdminResDto } from '../dto/res/admin.res.dto';

export class AdminMapper {
  public static toResponseDTO(user: AdminEntity): AdminResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
        ? `${process.env.AWS_S3_BUCKET_URL}/${user.image}`
        : null,
    };
  }

  public static toAdminDataDTO(
    admin: AdminEntity,
    deviceId: string,
  ): IUserData {
    return {
      role: admin.role,
      userId: admin.id,
      email: admin.email,
      deviceId,
    };
  }

  public static toResponseAdminDTO(
    admin: AdminEntity,
    tokenPair: ITokenPair,
  ): AuthAdminResDto {
    return {
      admin: AdminMapper.toResponseDTO(admin),
      tokens: this.toResponseRefreshDTO(tokenPair),
    };
  }

  public static toResponseRefreshDTO(tokenPair: ITokenPair): ITokenPair {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
