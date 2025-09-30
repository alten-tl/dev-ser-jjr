import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('clients')
export class Client {
  @ApiProperty({ description: 'Unique identifier for the client' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Client full name' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Client timezone' })
  @Column({ type: 'varchar', length: 100 })
  timezone: string;

  @ApiProperty({ description: 'Client address' })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({ description: 'Client status', enum: ClientStatus })
  @Column({ 
    type: 'enum', 
    enum: ClientStatus, 
    default: ClientStatus.ACTIVE 
  })
  status: ClientStatus;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Appointment, appointment => appointment.client)
  appointments: Appointment[];
}
