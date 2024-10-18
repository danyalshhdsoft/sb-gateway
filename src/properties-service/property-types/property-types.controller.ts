import { Controller, Get, Inject, OnModuleInit, Res } from '@nestjs/common';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROPERTY_TYPES_TOPIC,
} from 'src/utils/constants/kafka-const';
import { Response } from 'express';
import { catchException } from 'src/utils/helper/handle.exceptionh.helper';
import { PropertyTypesService } from './property-types.service';

@Controller('property-types')
export class PropertyTypesController implements OnModuleInit {
  constructor(
    private readonly propertyTypesService: PropertyTypesService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private propertyTypesClient: ClientKafka,
  ) {}

  @Get()
  async getAllPropertyTypes(@Res() res: Response) {
    try {
      const response = await this.propertyTypesService.getAllPropertyTypes();
      const data = {
        message: response.message,
        data: response.data,
      };
      return res.status(response.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  onModuleInit() {
    this.propertyTypesClient.subscribeToResponseOf(
      KAFKA_PROPERTY_TYPES_TOPIC.retrieve_property_types,
    );
  }
}
