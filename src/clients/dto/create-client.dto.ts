import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ 
    description: 'Client full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @ApiProperty({ 
    description: 'Client timezone',
    example: 'America/New_York',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  timezone: string;

  @ApiProperty({ 
    description: 'Client address',
    example: '123 Main St, New York, NY 10001'
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
