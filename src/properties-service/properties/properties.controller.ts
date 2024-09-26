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
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import ApiResponse from 'src/utils/api-response.util';

import { ClientKafka } from '@nestjs/microservices';

@Controller('properties')
export class PropertiesController implements OnModuleInit {
  constructor(
    private readonly propertiesService: PropertiesService,
    @Inject('PROPERTIES_SERVICE') private propertiesClient: ClientKafka,
  ) {}

  @Post('add-properties')
  async addNewPropertyByAdmin(@Body() propertyRequests: any) {
    const result = await this.propertiesService.addNewProperty(
      propertyRequests,
    );
    return new ApiResponse(result);
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
    this.propertiesClient.subscribeToResponseOf('add_properties');
    this.propertiesClient.subscribeToResponseOf('update_properties');
    this.propertiesClient.subscribeToResponseOf('retrieve_properties');
    this.propertiesClient.subscribeToResponseOf('delete_properties');
  }
}
