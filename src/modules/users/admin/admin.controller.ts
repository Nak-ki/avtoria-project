import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ApiFile } from '../../../common/decorators/api-file.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { BrandReqDto } from './dto/req/brand.req.dto';
import { AdminResDto } from './dto/res/admin.res.dto';
import { AdminService } from './services/admin.service';

@ApiTags('Admins')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @Get('me')
  public async getMe(@CurrentUser() userData: IUserData): Promise<AdminResDto> {
    return await this.adminService.getMe(userData);
  }

  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('avatar', false)
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    await this.adminService.uploadAvatar(userData, avatar);
  }

  @ApiBearerAuth()
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.adminService.deleteAvatar(userData);
  }

  @ApiBearerAuth()
  @Post('me/banned/:userId')
  public async bannedUsers(
    @CurrentUser() userData: IUserData,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.adminService.banUser(userData, userId);
  }

  @ApiBearerAuth()
  @Post('me/unbanned/:userId')
  public async unbannedUser(
    @CurrentUser() userData: IUserData,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.adminService.unbanUser(userData, userId);
  }

  @ApiBearerAuth()
  @Post('me/addBrand')
  public async addBrandToList(
    @CurrentUser() userData: IUserData,
    @Body() dto: BrandReqDto,
  ): Promise<void> {
    await this.adminService.addBrandToList(userData, dto);
  }
}
