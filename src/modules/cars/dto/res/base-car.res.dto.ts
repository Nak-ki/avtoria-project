import { ApiProperty } from '@nestjs/swagger';

export class BaseCarResDto {
  @ApiProperty({
    example: '121324354678976543fdg',
    description: 'The id of the Car',
  })
  id: string;

  @ApiProperty({
    example: 'AUDI',
    description: 'The name of the Brand',
  })
  public readonly brand: string;

  @ApiProperty({
    example: 'Q7',
    description: 'The model of the Car',
  })
  public readonly model: string;

  @ApiProperty({
    example: '100000',
    description: 'The price of the Car',
  })
  public readonly price: string;

  @ApiProperty({
    example: 'UAH',
    description: 'The currency of the Car price',
  })
  public readonly currency: string;

  @ApiProperty({
    example: '2007',
    description: 'The year of Car production',
  })
  public readonly year: string;

  @ApiProperty({
    description: 'The region where car situated',
  })
  public readonly region: string;

  @ApiProperty({
    description: 'The rate of the Car',
  })
  public readonly rate: string;

  @ApiProperty({
    description: 'The Car image',
  })
  public readonly image: string;

  @ApiProperty({
    description: 'The total price of the Car',
  })
  public readonly totalPrice: string;

  @ApiProperty({
    description: 'The base currency of the Car price',
  })
  public readonly baseCurrency: string;

  @ApiProperty({
    description: 'Is active',
  })
  public readonly isActive: boolean;
}
