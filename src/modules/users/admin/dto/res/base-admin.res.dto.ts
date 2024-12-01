import { ApiProperty } from '@nestjs/swagger';

export class BaseAdminResDto {
  @ApiProperty({
    example: '121324354678976543fdg',
    description: 'The id of the Administrator',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the Administrator',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'test@.gmail.com',
    description: 'The email of the Administrator',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'https://www.example.com/avatar.jpg',
    description: 'The avatar of the Administrator',
  })
  public readonly image?: string;
}
