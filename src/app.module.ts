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
        name: 'USER_SERVICE',
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
        name: 'AUTH_SERVICE',
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
        name: 'ADMIN_SERVICE',
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
    ]),
  ],
  controllers: [
    AppController,
    AdminController,
    PropertiesController,
    LocationsController,
    ProjectsController,
  ],
  providers: [
    AppService,
    AdminService,
    JwtStrategy,
    ConfigService,
    PropertiesService,
    LocationService,
    ProjectsService,
  ],
  exports: [JwtModule],
})
export class AppModule {}
