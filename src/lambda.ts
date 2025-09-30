import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Context } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import * as express from 'express';

let cachedServer: any;

async function createNestServer(): Promise<express.Express> {
  if (!cachedServer) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    
    const app = await NestFactory.create(AppModule, adapter);
    
    // Enable CORS
    app.enableCors();
    
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Examen Alten API')
      .setDescription('REST API for managing clients, vehicles, and appointments')
      .setVersion('1.0')
      .addTag('clients')
      .addTag('vehicles')
      .addTag('appointments')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    app.use(eventContext());
    await app.init();
    
    cachedServer = createServer(expressApp);
  }
  
  return cachedServer;
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const server = await createNestServer();
  return proxy(server, event, context, 'PROMISE').promise;
};
