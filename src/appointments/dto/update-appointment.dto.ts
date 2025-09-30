import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches, Length } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiProperty({ 
    description: 'Appointment date (YYYY-MM-DD)',
    example: '2024-12-25',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    required: false
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format'
  })
  date?: string;

  @ApiProperty({ 
    description: 'Appointment hour (HH:MM format)',
    example: '14:30',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
    required: false
  })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hour must be in HH:MM format (24-hour)'
  })
  hour?: string;

  @ApiProperty({ 
    description: 'Appointment comments',
    example: 'Regular maintenance check',
    required: false
  })
  @IsString()
  @IsOptional()
  @Length(0, 1000)
  comments?: string;
}
