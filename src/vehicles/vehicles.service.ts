import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Check if VIN already exists
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { vin: createVehicleDto.vin }
    });

    if (existingVehicle) {
      throw new ConflictException(`Vehicle with VIN ${createVehicleDto.vin} already exists`);
    }

    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      where: { status: 'ACTIVE' },
      relations: ['appointments'],
    });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id, status: 'ACTIVE' },
      relations: ['appointments'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async findByVin(vin: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { vin, status: 'ACTIVE' },
      relations: ['appointments'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with VIN ${vin} not found`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    
    // Check if VIN is being updated and if it already exists
    if (updateVehicleDto.vin && updateVehicleDto.vin !== vehicle.vin) {
      const existingVehicle = await this.vehicleRepository.findOne({
        where: { vin: updateVehicleDto.vin }
      });

      if (existingVehicle) {
        throw new ConflictException(`Vehicle with VIN ${updateVehicleDto.vin} already exists`);
      }
    }
    
    Object.assign(vehicle, updateVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    vehicle.status = 'INACTIVE';
    await this.vehicleRepository.save(vehicle);
  }
}
