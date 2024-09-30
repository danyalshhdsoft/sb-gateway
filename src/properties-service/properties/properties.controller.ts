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
      const data = {
        message: result.message,
        data: result.data,
      };
      return res.status(result.status).send(data);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  @Put(':id')
  async updatePropertyByAdmin(
    @Param('id') id: string,
    @Body() propertyRequests: any,
    @Res() res: Response,
  ) {
    const result = await this.propertiesService.updateProperty(
      id,
      propertyRequests,
    );
    const data = {
      message: result.message,
      data: result.data,
    };
    return res.status(result.status).send(data);
  }

  @Get()
  async getAllPropertyLists(@Res() res: Response) {
    const result = await this.propertiesService.getAllPropertyLists();
    const data = {
      message: result.message,
      data: result.data,
    };
    return res.status(result.status).send(data);
  }

  @Delete(':id')
  async deletePropertyFromList(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.propertiesService.deletePropertyFromList(id);
      const data = {
        message: result.message,
        data: result.data,
      };
      return res.status(result.status).send(data);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Failed to delete property', error: error.message });
    }
  }

  @Put('update-property-status/:id')
  async PropertyStatusUpdate(
    @Param('id') id: string,
    @Body() propertyRequests: any,
    @Res() res: Response,
  ) {
    const result = await this.propertiesService.PropertyStatusUpdate(
      id,
      propertyRequests,
    );
    const data = {
      message: result.message,
      data: result.data,
    };
    return res.status(result.status).send(data);
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
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_PROPERTIES_TOPIC.update_property_status,
    );
  }
}
