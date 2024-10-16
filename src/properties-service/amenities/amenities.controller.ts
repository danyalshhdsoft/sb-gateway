import { Controller, Get, Inject, OnModuleInit, Res } from '@nestjs/common';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_AMENITIES_TOPIC,
} from 'src/utils/constants/kafka-const';
import { Response } from 'express';
import { catchException } from 'src/utils/helper/handle.exceptionh.helper';
import { AmenitiesService } from './amenities.service';

@Controller('amenities')
export class AmenitiesController implements OnModuleInit {
  constructor(
    private readonly amenitiesService: AmenitiesService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private amenitiesClient: ClientKafka,
  ) {}

  @Get()
  async getAllAmenities(@Res() res: Response) {
    try {
      const response = await this.amenitiesService.getAllAmenities();
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
    this.amenitiesClient.subscribeToResponseOf(
      KAFKA_AMENITIES_TOPIC.retrieve_amenities,
    );
  }
}
