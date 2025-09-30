import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, Max, Length, Matches } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ 
    description: 'Vehicle Identification Number (VIN)',
    example: '1HGBH41JXMN109186',
    minLength: 17,
    maxLength: 17
  })
  @IsString()
  @IsNotEmpty()
  @Length(17, 17)
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'VIN must be exactly 17 characters and contain only valid VIN characters'
  })
  vin: string;

  @ApiProperty({ 
    description: 'License plates',
    example: 'ABC-123',
    minLength: 1,
    maxLength: 20
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  plates: string;

  @ApiProperty({ 
    description: 'Vehicle color',
    example: 'Red',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  color: string;

  @ApiProperty({ 
    description: 'Manufacturing year',
    example: 2020,
    minimum: 1900,
    maximum: 2030
  })
  @IsInt()
  @Min(1900)
  @Max(2030)
  year: number;

  @ApiProperty({ 
    description: 'Vehicle model',
    example: 'Toyota Camry',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  model: string;
}
