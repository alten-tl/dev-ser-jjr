import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ClientsService } from '../clients/clients.service';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly clientsService: ClientsService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Validate that client and vehicle exist
    await this.clientsService.findOne(createAppointmentDto.clientId);
    await this.vehiclesService.findOne(createAppointmentDto.vehicleId);

    // Check if time slot is already taken
    await this.validateTimeSlotAvailability(
      createAppointmentDto.date,
      createAppointmentDto.hour,
    );

    const appointment = this.appointmentRepository.create(createAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async findByDate(date: string): Promise<Appointment[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return await this.appointmentRepository.find({
      where: {
        date: Between(startDate, endDate),
        status: AppointmentStatus.ENABLED,
      },
      relations: ['client', 'vehicle'],
      order: {
        hour: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id, status: AppointmentStatus.ENABLED },
      relations: ['client', 'vehicle'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // If updating date or hour, validate time slot availability
    if (updateAppointmentDto.date || updateAppointmentDto.hour) {
      const newDate = updateAppointmentDto.date || appointment.date;
      const newHour = updateAppointmentDto.hour || appointment.hour;
      
      await this.validateTimeSlotAvailability(newDate, newHour, id);
    }

    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async cancel(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    appointment.status = AppointmentStatus.DISABLED;
    appointment.updatedAt = new Date();
    
    return await this.appointmentRepository.save(appointment);
  }

  private async validateTimeSlotAvailability(
    date: string,
    hour: string,
    excludeId?: string,
  ): Promise<void> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.date = :date', { date })
      .andWhere('appointment.hour = :hour', { hour })
      .andWhere('appointment.status = :status', { status: AppointmentStatus.ENABLED });

    if (excludeId) {
      query.andWhere('appointment.id != :excludeId', { excludeId });
    }

    const existingAppointment = await query.getOne();

    if (existingAppointment) {
      throw new ConflictException(
        `Time slot ${hour} on ${date} is already taken`,
      );
    }
  }

  private validateDateAndHour(date: string, hour: string): void {
    const appointmentDate = new Date(date);
    const now = new Date();
    
    // Check if date is in the past
    if (appointmentDate < now.setHours(0, 0, 0, 0)) {
      throw new BadRequestException('Cannot create appointments in the past');
    }

    // Check if appointment is more than 1 year in the future
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (appointmentDate > oneYearFromNow) {
      throw new BadRequestException('Cannot create appointments more than 1 year in advance');
    }
  }
}
