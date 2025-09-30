import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class AppointmentByDateDto {
  @ApiProperty({ 
    description: 'Date to filter appointments (YYYY-MM-DD)',
    example: '2024-12-25',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$'
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format'
  })
  date: string;
}
