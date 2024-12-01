import * as process from 'node:process';

import { UserEntity } from '../../../../database/entities/user.entity';
import { IUserData } from '../../../auth/models/interfaces/user-data.interface';
import { UserResDto } from '../dto/res/user.res.dto';

export class UserMapper {
  public static toResponseDTO(user: UserEntity): UserResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      image: user.image
        ? `${process.env.AWS_S3_BUCKET_URL}/${user.image}`
        : null,
      isBanned: user.isBanned,
    };
  }
  public static toUserDataDTO(user: UserEntity, deviceId: string): IUserData {
    return {
      role: user.role,
      userId: user.id,
      email: user.email,
      deviceId,
    };
  }
}
