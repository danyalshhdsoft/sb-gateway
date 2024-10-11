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
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_ELASTIC_SEARCH_TOPIC,
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

  @Get('autocomplete')
  async autocomplete(
    @Query('query') query: string,
    @Res() res: Response,
  ) {
    const result = await this.propertiesService.searchAutocomplete(
      query
    );
    const data = {
      message: result.message,
      data: result.data,
    };
    return res.status(result.status).send(data);
  }

  @Get('search')
  async searchProperties(
    @Query('query') query: string,
    @Query('bedroom') bedroom: string,
    @Query('washroom') washroom: string,
    @Query('purpose') purpose: string,
    @Query('status') status: string,
    @Query('completionStatus') completionStatus: string,
    @Query('propertyType') propertyType: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('from') from: string,
    @Query('size') size: string,
    @Res() res: Response,
  ) {
    const result = await this.propertiesService.searchProperties(
      query,
      bedroom,
      washroom,
      purpose,
      status,
      completionStatus,
      propertyType,
      minPrice,
      maxPrice,
      from,
      size
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
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_ELASTIC_SEARCH_TOPIC.searchAutocomplete,
    );
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_ELASTIC_SEARCH_TOPIC.search,
    );
  }
}
