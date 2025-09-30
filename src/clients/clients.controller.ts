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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ 
    status: 201, 
    description: 'Client created successfully',
    type: Client
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return await this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active clients' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all active clients',
    type: [Client]
  })
  async findAll(): Promise<Client[]> {
    return await this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Client found',
    type: Client
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(@Param('id') id: string): Promise<Client> {
    return await this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Client updated successfully',
    type: Client
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string, 
    @Body() updateClientDto: UpdateClientDto
  ): Promise<Client> {
    return await this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client (soft delete)' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.clientsService.remove(id);
  }
}
