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
        name: 'PROPERTIES_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'properties-service',
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'properties-consumer',
          },
        },
      },
      {
        name: 'PROJECTS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'projects-service',
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'projects-consumer',
          },
        },
      },
      {
        name: 'DEVELOPERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'developers-service',
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'developers-consumer',
          },
        },
      },
      {
        name: 'LOCATIONS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'locations-service',
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'locations-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController, AdminController, PropertiesController],
  providers: [
    AppService,
    AdminService,
    JwtStrategy,
    ConfigService,
    PropertiesService,
  ],
  exports: [JwtModule],
})
export class AppModule {}
