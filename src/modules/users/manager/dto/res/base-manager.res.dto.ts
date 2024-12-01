import { ApiProperty } from '@nestjs/swagger';

export class BaseManagerResDto {
  @ApiProperty({
    example: '121324354678976543fdg',
    description: 'The id of the Manager',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the Manager',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'test@.gmail.com',
    description: 'The email of the Manager',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'This is a bio',
    description: 'The phone of the Manager',
  })
  public readonly phone?: string;

  @ApiProperty({
    example: 'https://www.example.com/avatar.jpg',
    description: 'The avatar of the Manager',
  })
  public readonly image?: string;
}
