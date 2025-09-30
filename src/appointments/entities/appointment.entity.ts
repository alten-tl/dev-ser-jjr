import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../../clients/entities/client.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

export enum AppointmentStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

@Entity('appointments')
export class Appointment {
  @ApiProperty({ description: 'Unique identifier for the appointment' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Appointment date (YYYY-MM-DD)' })
  @Column({ type: 'date' })
  date: string;

  @ApiProperty({ description: 'Appointment hour (HH:MM format)' })
  @Column({ type: 'time' })
  hour: string;

  @ApiProperty({ description: 'Appointment comments' })
  @Column({ type: 'text', nullable: true })
  comments: string;

  @ApiProperty({ description: 'Appointment status', enum: AppointmentStatus })
  @Column({ 
    type: 'enum', 
    enum: AppointmentStatus, 
    default: AppointmentStatus.ENABLED 
  })
  status: AppointmentStatus;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Related client' })
  @ManyToOne(() => Client, client => client.appointments, { eager: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ApiProperty({ description: 'Client ID' })
  @Column({ type: 'uuid' })
  clientId: string;

  @ApiProperty({ description: 'Related vehicle' })
  @ManyToOne(() => Vehicle, vehicle => vehicle.appointments, { eager: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @ApiProperty({ description: 'Vehicle ID' })
  @Column({ type: 'uuid' })
  vehicleId: string;
}
