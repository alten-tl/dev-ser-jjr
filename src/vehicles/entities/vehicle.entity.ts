import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('vehicles')
export class Vehicle {
  @ApiProperty({ description: 'Unique identifier for the vehicle' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Vehicle Identification Number (VIN)' })
  @Column({ type: 'varchar', length: 17, unique: true })
  vin: string;

  @ApiProperty({ description: 'License plates' })
  @Column({ type: 'varchar', length: 20 })
  plates: string;

  @ApiProperty({ description: 'Vehicle color' })
  @Column({ type: 'varchar', length: 50 })
  color: string;

  @ApiProperty({ description: 'Manufacturing year' })
  @Column({ type: 'int' })
  year: number;

  @ApiProperty({ description: 'Vehicle model' })
  @Column({ type: 'varchar', length: 100 })
  model: string;

  @ApiProperty({ description: 'Vehicle status', enum: VehicleStatus })
  @Column({ 
    type: 'enum', 
    enum: VehicleStatus, 
    default: VehicleStatus.ACTIVE 
  })
  status: VehicleStatus;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Appointment, appointment => appointment.vehicle)
  appointments: Appointment[];
}
