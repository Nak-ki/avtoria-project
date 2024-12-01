import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { AdminRightsGuard } from './guards/admin-rights.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { SignInReqDto } from './models/dto/req/sign-in.req.dto';
import { SignUpReqDto } from './models/dto/req/sign-up.req.dto';
import {
  AuthAdminResDto,
  AuthManagerResDto,
  AuthResDto,
} from './models/dto/res/auth.res.dto';
import { TokenPairResDto } from './models/dto/res/token-pair.res.dto';
import { IUserData } from './models/interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.authService.signUp(dto);
  }
  @SkipAuth()
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.signIn(dto);
  }

  @SkipAuth()
  @Post('admin/sign-up')
  public async singUpAdmin(
    @Body() dto: SignUpReqDto,
  ): Promise<AuthAdminResDto> {
    return await this.authService.singUpAdmin(dto);
  }

  @SkipAuth()
  @Post('admin/sign-in')
  public async signInAdmin(
    @Body() dto: SignInReqDto,
  ): Promise<AuthAdminResDto> {
    return await this.authService.singInAdmin(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminRightsGuard)
  @Post('manager/sign-up')
  public async singUpManager(
    @Body() dto: SignUpReqDto,
  ): Promise<AuthManagerResDto> {
    return await this.authService.singUpManager(dto);
  }

  @SkipAuth()
  @Post('manager/sign-in')
  public async signInManager(
    @Body() dto: SignInReqDto,
  ): Promise<AuthManagerResDto> {
    return await this.authService.singInManager(dto);
  }

  @ApiBearerAuth()
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.signOut(userData);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }
}
