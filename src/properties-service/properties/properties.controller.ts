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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROPERTIES_TOPIC,
} from 'src/utils/constants/kafka-const';
import { Response } from 'express';
import { catchException } from 'src/utils/helper/handle.exceptionh.helper';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
@Controller('properties')
export class PropertiesController implements OnModuleInit {
  constructor(
    private readonly propertiesService: PropertiesService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private propertiesClient: ClientKafka,
  ) {}

  @Post('add-properties')
  @UseInterceptors(AnyFilesInterceptor())
  async addNewPropertyByAdmin(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() propertyRequests: any,
    @Res() res: Response,
  ) {
    try {
      // Filter uploaded files by fieldname
      const images = files.filter((file) => file.fieldname === 'images');
      const oPropertyRequest = JSON.parse(propertyRequests);

      const media = {
        images: images,
        image360Tour: oPropertyRequest.image360Tour,
        videos: oPropertyRequest.videos,
      };

      const oRequestbody = {
        oPropertyRequest,
        media,
      };
      //currently the sb-uploads send event is going from sb-properties move that here
      //send an event with media object from here and then from the response send the response to sb-properties below
      const result = await this.propertiesService.addNewProperty(oRequestbody);
      const data = {
        message: result.message,
        data: result.data,
      };
      return res.status(result.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  @Post('test-uploads')
  @UseInterceptors(AnyFilesInterceptor())
  async testUploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() propertyRequests: any,
    @Res() res: Response,
  ) {
    try {
      // Filter uploaded files by fieldname
      const images = files.filter((file) => file.fieldname === 'images');
      // const oPropertyRequest = JSON.parse(propertyRequests);
      const oPropertyRequest = propertyRequests;
      const media = {
        images: images,
        image360Tour: oPropertyRequest.image360Tour,
        videos: oPropertyRequest.videos,
      };

      const oRequestbody = {
        oPropertyRequest,
        media,
      };

      const result = await this.propertiesService.testUploadFile(oRequestbody);
      const data = {
        message: result.message,
        data: result.data,
      };
      return res.status(result.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  @Put(':id')
  async updatePropertyByAdmin(
    @Param('id') id: string,
    @Body() propertyRequests: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.propertiesService.updateProperty(
        id,
        propertyRequests,
      );
      const data = {
        message: result.message,
        data: result.data,
      };
      return res.status(result.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  @Get()
  async getAllPropertyLists(@Res() res: Response) {
    try {
      const result = await this.propertiesService.getAllPropertyLists();
      const data = {
        message: result.message,
        data: result.data,
      };
      return res.status(result.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
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
      catchException(error);
    }
  }

  @Put('update-property-status/:id')
  async PropertyStatusUpdate(
    @Param('id') id: string,
    @Body() propertyRequests: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.propertiesService.PropertyStatusUpdate(
        id,
        propertyRequests,
      );
      const data = {
        message: result.message,
        data: result.data,
      };
      return res.status(result.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
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
    this.propertiesClient.subscribeToResponseOf('test-uploads');
  }
}
