import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AccountTypeEnum } from '../../../common/enums/account-type.enum';
import { CarEntity } from '../../../database/entities/car.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { EmailService } from '../../emails/email.service';
import { EmailTypeEnum } from '../../emails/enums/email-type.enum';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { CarRepository } from '../../repository/services/car.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { ViewRepository } from '../../repository/services/view.repository';
import { CreateCarReqDto } from '../dto/req/create-car.req.dto';
import { ListCarQueryDto } from '../dto/req/list-car-query.dto';
import { CarResDto } from '../dto/res/car.res.dto';
import { IPrivatBank } from '../interfaces/privat-bank.interface';
import { swearWords } from '../swear-words';
import { CarMapper } from './car.mapper';

@Injectable()
export class CarService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly carRepository: CarRepository,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
    private readonly viewRepository: ViewRepository,
  ) {}

  public async findAll(query: ListCarQueryDto): Promise<[CarEntity[], number]> {
    return await this.carRepository.findAll(query);
  }

  public async createCar(
    userData: IUserData,
    dto: CreateCarReqDto,
  ): Promise<CarResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const cars = await this.carRepository.findBy({ user_id: user.id });
    if (user.account === AccountTypeEnum.BASE && cars.length >= 1) {
      throw new ForbiddenException();
    }
    let isActive: boolean;
    if (swearWords.includes(dto.model) || swearWords.includes(dto.brand)) {
      isActive = false;
    } else isActive = true;

    const { data } = await this.httpService.axiosRef.get<IPrivatBank[]>(
      'https://api.privatbank.ua/p24api/pubinfo',
    );
    let rate: string;
    let totalPrice: string;

    switch (dto.currency) {
      case 'UAH':
        totalPrice = dto.price;
        rate = '0';
        break;
      case 'USD':
        const usdCurrency = data.find((value) => value.ccy === dto.currency);
        totalPrice = (+dto.price * usdCurrency.sale).toString();
        rate = usdCurrency.sale.toString();
        break;
      case 'EUR':
        const euhCurrency = data.find((value) => value.ccy === dto.currency);
        totalPrice = (+dto.price * euhCurrency.sale).toString();
        rate = euhCurrency.sale.toString();
        break;
    }
    const car = await this.carRepository.save(
      this.carRepository.create({
        ...dto,
        price: dto.price.toString(),
        totalPrice: totalPrice.toString(),
        rate,
        isActive: isActive,
        user_id: userData.userId,
      }),
    );
    if (!isActive) {
      await this.emailService.sendMail(
        EmailTypeEnum.NOT_ACTIVE_AD,
        user.email,
        { carId: car.id },
      );
    }
    return CarMapper.toResponseDTO(car);
  }

  public async deleteCar(userData: IUserData, carId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const car = await this.carRepository.findBy({
      id: carId,
      user_id: user.id,
    });

    if (!car) {
      throw new NotFoundException();
    }
    await this.carRepository.remove(car);
  }

  public async getCarById(carId: string): Promise<CarResDto> {
    const car = await this.carRepository.findCarById(carId);
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    const browsing = +car.browsing + 1;
    await this.carRepository.update(carId, {
      browsing: browsing.toString(),
    });

    await this.viewRepository.save(
      this.viewRepository.create({ car_id: car.id }),
    );

    return CarMapper.toResponseDTO(car);
  }

  public async uploadCarImage(
    userData: IUserData,
    image: Express.Multer.File,
    carId: string,
  ): Promise<void> {
    const img = await this.fileStorageService.uploadFile(
      image,
      ContentType.CAR_IMAGE,
      carId,
    );
    await this.carRepository.update(carId, { image: img });
  }

  public async deleteCarImage(
    userData: IUserData,
    carId: string,
  ): Promise<void> {
    const car = await this.carRepository.findOneBy({ id: carId });
    if (car.image) {
      await this.fileStorageService.deleteFile(car.image);
      await this.carRepository.save(
        this.carRepository.merge(car, { image: null }),
      );
    }
  }

  public async getAvgPrice(userData: IUserData, carId: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const car = await this.carRepository.findOneBy({ id: carId });
    if (user.account === AccountTypeEnum.BASE) {
      throw new ForbiddenException();
    }
    const carsByRegion = await this.carRepository.findBy({
      model: car.model,
      region: car.region,
    });
    const avgPriceByRegion = this.getAvgCarPrice(carsByRegion);
    const carsByModel = await this.carRepository.findBy({
      model: car.model,
    });
    const avgPrice = this.getAvgCarPrice(carsByModel);

    const weekViews = await this.viewRepository.getByWeek(car.id);
    const monthViews = await this.viewRepository.getByMonth(car.id);
    const yearViews = await this.viewRepository.getByYear(car.id);

    return {
      avgPriceByRegion,
      avgPrice,
      browsing: car.browsing,
      yearViews: yearViews,
      monthViews: monthViews,
      weekViews: weekViews,
    };
  }

  private getAvgCarPrice(cars: CarEntity[]): number {
    let avgCurrency = 0;
    for (const car of cars) {
      avgCurrency = avgCurrency + Number(car.totalPrice);
    }
    const avgPrice = avgCurrency / cars.length;
    return avgPrice;
  }
}
