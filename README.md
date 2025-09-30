# Examen Alten - NestJS API

A REST API built with NestJS for managing clients, vehicles, and appointments.

## Features

- **Clients Management**: Create, read, update, and delete clients
- **Vehicles Management**: Manage vehicle information with VIN validation
- **Appointments Management**: Schedule and manage appointments with time slot validation
- **PostgreSQL Database**: Using TypeORM for database operations
- **Swagger Documentation**: Interactive API documentation
- **Serverless Ready**: Compatible with AWS Lambda via Serverless Framework
- **Docker Support**: PostgreSQL database running in Docker

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Serverless Framework
- **Containerization**: Docker

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd examen-alten
```

2. Install dependencies:
```bash
npm install
```

3. Start PostgreSQL database:
```bash
npm run docker:up
```

4. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=examen_alten
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Serverless Offline (Lambda simulation)
```bash
npm run build
npm run serverless:offline
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
- http://localhost:3000/api

## API Endpoints

### Clients
- `GET /clients` - Get all active clients
- `POST /clients` - Create a new client
- `GET /clients/:id` - Get a client by ID
- `PATCH /clients/:id` - Update a client
- `DELETE /clients/:id` - Delete a client (soft delete)

### Vehicles
- `GET /vehicles` - Get all active vehicles
- `POST /vehicles` - Create a new vehicle
- `GET /vehicles/:id` - Get a vehicle by ID
- `GET /vehicles/vin/:vin` - Get a vehicle by VIN
- `PATCH /vehicles/:id` - Update a vehicle
- `DELETE /vehicles/:id` - Delete a vehicle (soft delete)

### Appointments
- `GET /appointments?date=YYYY-MM-DD` - Get appointments by date
- `POST /appointments` - Create a new appointment
- `GET /appointments/:id` - Get an appointment by ID
- `PATCH /appointments/:id` - Update an appointment
- `DELETE /appointments/:id` - Cancel an appointment (soft delete)

## Database Schema

### Clients
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `timezone` (VARCHAR)
- `address` (TEXT)
- `status` (ENUM: ACTIVE, INACTIVE)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Vehicles
- `id` (UUID, Primary Key)
- `vin` (VARCHAR, Unique)
- `plates` (VARCHAR)
- `color` (VARCHAR)
- `year` (INTEGER)
- `model` (VARCHAR)
- `status` (ENUM: ACTIVE, INACTIVE)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Appointments
- `id` (UUID, Primary Key)
- `date` (DATE)
- `hour` (TIME)
- `comments` (TEXT, Nullable)
- `status` (ENUM: ENABLED, DISABLED)
- `clientId` (UUID, Foreign Key)
- `vehicleId` (UUID, Foreign Key)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Validation Rules

### Client
- Name: 2-255 characters
- Timezone: 3-100 characters
- Address: Required

### Vehicle
- VIN: Exactly 17 characters, valid VIN format
- Plates: 1-20 characters
- Color: 2-50 characters
- Year: 1900-2030
- Model: 2-100 characters

### Appointment
- Date: YYYY-MM-DD format
- Hour: HH:MM format (24-hour)
- Comments: Optional, max 1000 characters
- Time slot validation: Prevents double booking

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker Commands

```bash
# Start database
npm run docker:up

# Stop database
npm run docker:down
```

## Serverless Deployment

```bash
# Deploy to AWS
npm run serverless:deploy

# Deploy to specific stage
npx serverless deploy --stage production
```

## Git Workflow

The project follows a branching strategy with:
- `master` - Production branch
- `dev` - Development branch
- `qa` - Quality assurance branch

### Commit Convention
```
[module-name] - Short description
```

Examples:
- `[clients] - Add client validation`
- `[appointments] - Fix time slot validation`
- `[vehicles] - Update VIN validation`

## Contributing

1. Create a feature branch from `dev`
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Create a pull request to `dev`

## License

This project is licensed under the UNLICENSED License.