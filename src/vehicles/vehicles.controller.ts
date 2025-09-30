import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ 
    status: 201, 
    description: 'Vehicle created successfully',
    type: Vehicle
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Vehicle with this VIN already exists' })
  async create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return await this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active vehicles' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all active vehicles',
    type: [Vehicle]
  })
  async findAll(): Promise<Vehicle[]> {
    return await this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vehicle found',
    type: Vehicle
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findOne(@Param('id') id: string): Promise<Vehicle> {
    return await this.vehiclesService.findOne(id);
  }

  @Get('vin/:vin')
  @ApiOperation({ summary: 'Get a vehicle by VIN' })
  @ApiParam({ name: 'vin', description: 'Vehicle VIN' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vehicle found',
    type: Vehicle
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findByVin(@Param('vin') vin: string): Promise<Vehicle> {
    return await this.vehiclesService.findByVin(vin);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vehicle updated successfully',
    type: Vehicle
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Vehicle with this VIN already exists' })
  async update(
    @Param('id') id: string, 
    @Body() updateVehicleDto: UpdateVehicleDto
  ): Promise<Vehicle> {
    return await this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a vehicle (soft delete)' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ status: 204, description: 'Vehicle deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.vehiclesService.remove(id);
  }
}
