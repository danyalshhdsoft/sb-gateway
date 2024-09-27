import {
  Controller,
  Post,
  Param,
  Body,
  Put,
  Get,
  Delete,
  Inject,
  OnModuleInit,
  Res,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import ApiResponse from 'src/utils/api-response.util';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROPERTIES_TOPIC,
} from 'src/utils/constants/kafka-const';
import { Response } from 'express';

@Controller('properties')
export class PropertiesController implements OnModuleInit {
  constructor(
    private readonly propertiesService: PropertiesService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private propertiesClient: ClientKafka,
  ) {}

  @Post('add-properties')
  async addNewPropertyByAdmin(
    @Body() propertyRequests: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.propertiesService.addNewProperty(
        propertyRequests,
      );
      return res.status(result.status).send(result.data);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  @Put(':id')
  async updatePropertyByAdmin(
    @Param('id') id: string,
    @Body() propertyRequests: any,
  ) {
    const result = await this.propertiesService.updateProperty(
      id,
      propertyRequests,
    );
    return new ApiResponse(result);
  }

  @Get()
  async getAllPropertyLists() {
    const result = await this.propertiesService.getAllPropertyLists();
    return new ApiResponse(result);
  }

  @Delete(':id')
  async deletePropertyFromList(@Param('id') id: string) {
    const result = await this.propertiesService.deletePropertyFromList(id);
    return new ApiResponse(result);
  }

  onModuleInit() {
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_PROPERTIES_TOPIC.add_properties,
    );
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_PROPERTIES_TOPIC.update_properties,
    );
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_PROPERTIES_TOPIC.retrieve_properties,
    );
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_PROPERTIES_TOPIC.delete_properties,
    );
  }
}
