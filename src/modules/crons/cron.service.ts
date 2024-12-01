import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { IPrivatBank } from '../cars/interfaces/privat-bank.interface';
import { CarRepository } from '../repository/services/car.repository';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly httpService: HttpService;
  private readonly carRepository: CarRepository;

  @Cron('* * 6 * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 45');

    const { data } = await this.httpService.axiosRef.get<IPrivatBank[]>(
      'https://api.privatbank.ua/p24api/pubinfo',
    );
    let rate: string;
    let totalPrice: number;
    const cars = await this.carRepository.findBy({ isActive: true });

    for (const car of cars) {
      switch (car.currency) {
        case 'UAH':
          totalPrice = +car.price;
          break;
        case 'USD':
          const usdCurrency = data.find((value) => value.ccy === car.currency);
          totalPrice = +car.price * usdCurrency.sale;
          rate = usdCurrency.sale.toString();
          break;
        case 'EUR':
          const euhCurrency = data.find((value) => value.ccy === car.currency);
          totalPrice = +car.price * euhCurrency.sale;
          rate = euhCurrency.sale.toString();
          break;
      }
      await this.carRepository.save({
        ...car,
        totalPrice: totalPrice.toString(),
        rate: rate ? rate : car.rate,
      });
    }
  }
}
