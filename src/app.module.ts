import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { AdminJwtStrategy } from './auth/strategies/admin-jwt.strategy';
import { SERVICE_TYPES } from './enums/service-types.enum';
import { PropertiesController } from './properties-service/properties/properties.controller';
import { PropertiesService } from './properties-service/properties/properties.service';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_CONSUMER_GROUP_ID,
  KAFKA_OPTIONS_CLIENT_ID,
} from './utils/constants/kafka-const';
import { LocationsController } from './properties-service/locations/locations.controller';
import { LocationService } from './properties-service/locations/locations.service';
import { ProjectsController } from './properties-service/projects/projects.controller';
import { ProjectsService } from './properties-service/projects/projects.service';
import { DevelopersController } from './properties-service/developers/developers.controller';
import { DevelopersService } from './properties-service/developers/developers.service';
import { BroadcastUploadsService } from './properties-service/properties/broadcast-uploads.service';
import { PropertyTypesService } from './properties-service/property-types/property-types.service';
import { PropertyTypesController } from './properties-service/property-types/property-types.controller';
import { AmenitiesController } from './properties-service/amenities/amenities.controller';
import { AmenitiesService } from './properties-service/amenities/amenities.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    ClientsModule.register([
      {
        name: SERVICE_TYPES.USER_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'property',
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
      {
        name: SERVICE_TYPES.AUTH_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'property',
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
      {
        name: SERVICE_TYPES.ADMIN_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'property',
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'admin-consumer',
          },
        },
      },
      {
        name: CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KAFKA_OPTIONS_CLIENT_ID.properties_service,
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: KAFKA_CONSUMER_GROUP_ID.properties_consumer,
          },
        },
      },
      {
        name: CLIENTS_MODULE_KAFKA_NAME_PROPERTY.UPLOADS_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KAFKA_OPTIONS_CLIENT_ID.uploads_service,
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: KAFKA_CONSUMER_GROUP_ID.uploads_consumer,
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AdminController,
    PropertiesController,
    LocationsController,
    ProjectsController,
    DevelopersController,
    PropertyTypesController,
    AmenitiesController,
  ],
  providers: [
    AppService,
    AdminService,
    JwtStrategy, AdminJwtStrategy,
    ConfigService,
    PropertiesService,
    LocationService,
    ProjectsService,
    DevelopersService,
    BroadcastUploadsService,
    PropertyTypesService,
    AmenitiesService,
  ],
  exports: [JwtModule],
})
export class AppModule {}
