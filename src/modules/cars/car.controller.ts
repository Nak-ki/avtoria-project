import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ApiFile } from '../../common/decorators/api-file.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
// import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { CreateCarReqDto } from './dto/req/create-car.req.dto';
import { ListCarQueryDto } from './dto/req/list-car-query.dto';
import { CarResDto } from './dto/res/car.res.dto';
import { CarListResDto } from './dto/res/car-list.res.dto';
import { CarMapper } from './services/car.mapper';
import { CarService } from './services/car.service';

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @SkipAuth()
  @Get()
  public async findAll(
    @Query() query: ListCarQueryDto,
  ): Promise<CarListResDto> {
    const [entities, total] = await this.carService.findAll(query);
    return CarMapper.toResDtoList(entities, total, query);
  }

  @ApiBearerAuth()
  @Post()
  public async createCar(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarReqDto,
  ): Promise<CarResDto> {
    return await this.carService.createCar(userData, dto);
  }

  @ApiBearerAuth()
  @Delete(':carId')
  public async removeCar(
    @CurrentUser() userData: IUserData,
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<void> {
    return await this.carService.deleteCar(userData, carId);
  }

  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('image', false)
  @Post(':carId/image')
  public async uploadImage(
    @CurrentUser() userData: IUserData,
    @UploadedFile() image: Express.Multer.File,
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<void> {
    await this.carService.uploadCarImage(userData, image, carId);
  }

  @ApiBearerAuth()
  @Delete(':carId/image')
  public async deleteImage(
    @CurrentUser() userData: IUserData,
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<void> {
    await this.carService.deleteCarImage(userData, carId);
  }

  @SkipAuth()
  @Get(':carId')
  public async getCarById(
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<CarResDto> {
    return await this.carService.getCarById(carId);
  }

  @ApiBearerAuth()
  @Get(':carId/averagePrice')
  public async getAvgPrice(
    @CurrentUser() userData: IUserData,
    @Param('carId', ParseUUIDPipe) carId: string,
  ): Promise<any> {
    return await this.carService.getAvgPrice(userData, carId);
  }
}
