import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResDto {
  @ApiProperty({
    example: '121324354678976543fdg',
    description: 'The id of the User',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the User',
  })
  public readonly name: string;

  @ApiProperty({
    example: '+38 (097) 675-56-65',
    description: 'The phone of the User',
  })
  public readonly phone: string;

  @ApiProperty({
    example: 'test@.gmail.com',
    description: 'The email of the User',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'seller',
    description: 'The role of the User',
  })
  public readonly role: string;

  @ApiProperty({
    example: 'https://www.example.com/avatar.jpg',
    description: 'The avatar of the User',
  })
  public readonly image?: string;

  @ApiProperty({
    description: 'The User was banned',
  })
  public readonly isBanned?: boolean;
}
