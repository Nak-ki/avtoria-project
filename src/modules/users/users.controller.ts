import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiFile } from '../../common/decorators/api-file.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { UpdateUserReqDto } from './user/dto/req/update-user.req.dto';
import { UserResDto } from './user/dto/res/user.res.dto';
import { UserService } from './user/services/user.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('me')
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    return await this.usersService.getMe(userData);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.usersService.updateMe(userData, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.usersService.removeMe(userData);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('avatar', false)
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    await this.usersService.uploadAvatar(userData, avatar);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.deleteAvatar(userData);
  }

  @SkipAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  public async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResDto> {
    return await this.usersService.getById(id);
  }
}

//   @ApiBearerAuth()
//   @ApiConsumes('multipart/form-data')
//   @UseInterceptors(FileInterceptor('avatar'))
//   @ApiFile('avatar', false, true)
//   @Post('me/avatar')
//   public async uploadAvatar(
//     @CurrentUser() userData: IUserData,
//     @UploadedFile() file: Express.Multer.File,
//   ): Promise<void> {
//     await this.usersService.uploadAvatar(userData, file);
//   }
//
//   @ApiBearerAuth()
//   @Delete('me/avatar')
//   public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
//     await this.usersService.deleteAvatar(userData);
//   }
//
//   @SkipAuth()
//   @Get(':userId')
//   public async findOne(
//     @Param('userId', ParseUUIDPipe) userId: UserID,
//   ): Promise<UserBaseResDto> {
//     const result = await this.usersService.findOne(userId);
//     return CarMapper.toResDto(result);
//   }
//
//   @ApiBearerAuth()
//   @Post(':userId/follow')
//   public async follow(
//     @Param('userId', ParseUUIDPipe) userId: UserID,
//     @CurrentUser() userData: IUserData,
//   ): Promise<void> {
//     await this.usersService.follow(userData, userId);
//   }
//
//   @ApiBearerAuth()
//   @Delete(':userId/follow')
//   public async unfollow(
//     @Param('userId', ParseUUIDPipe) userId: UserID,
//     @CurrentUser() userData: IUserData,
//   ): Promise<void> {
//     await this.usersService.unfollow(userData, userId);
//   }
// }
