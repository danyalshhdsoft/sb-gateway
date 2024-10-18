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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_ELASTIC_SEARCH_TOPIC,
  KAFKA_FILE_UPLOADS_TOPIC,
  KAFKA_PROPERTIES_TOPIC,
} from 'src/utils/constants/kafka-const';
import { Request, Response } from 'express';
import { catchException } from 'src/utils/helper/handle.exceptionh.helper';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { BroadcastUploadsService } from './broadcast-uploads.service';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt-auth.guard';
import { AdminJWTPayload } from 'src/interface/admin-jwt-payload';
@Controller('properties')
export class PropertiesController implements OnModuleInit {
  constructor(
    private readonly propertiesService: PropertiesService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private propertiesClient: ClientKafka,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.UPLOADS_SERVICE)
    private uploadsClient: ClientKafka,
    private BroadcastService: BroadcastUploadsService,
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
      const images =
        files && files.length > 0
          ? files.filter((file) => file.fieldname === 'images')
          : [];
      // const oPropertyRequest = JSON.parse(propertyRequests);
      const oPropertyRequest = propertyRequests;
      let imagesMeta = [];
      if (images.length > 0) {
        const uploads = await this.BroadcastService.BroadcastFileUpload(
          images,
          KAFKA_FILE_UPLOADS_TOPIC.upload_files,
          'properties',
        );
        oPropertyRequest.media['images'] =
          uploads && uploads.filesUrls ? uploads.filesUrls : [];
        imagesMeta = uploads.metadata;
      }
      const oRequestbody = {
        oPropertyRequest,
        imagesMeta,
      };

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
      const images =
        files && files.length > 0
          ? files.filter((file) => file.fieldname === 'images')
          : [];
      // const oPropertyRequest = JSON.parse(propertyRequests);
      const oPropertyRequest = propertyRequests;
      let imagesMeta = [];
      if (images.length > 0) {
        const uploads = await this.BroadcastService.BroadcastFileUpload(
          images,
          KAFKA_FILE_UPLOADS_TOPIC.upload_files,
          'properties',
        );
        console.log(uploads);
        oPropertyRequest['images'] =
          uploads && uploads.filesUrls ? uploads.filesUrls : [];
        imagesMeta = uploads.metadata;
      }
      const oRequestbody = {
        oPropertyRequest,
        imagesMeta,
      };
      const data = {
        message: 'Test is successfull',
        data: oRequestbody,
      };
      return res.status(200).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async updatePropertyByAdmin(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @Body() propertyRequests: any,
    @Res() res: Response,
  ) {
    try {
      const images =
        files && files.length > 0
          ? files.filter((file) => file.fieldname === 'images')
          : [];
      // const oPropertyRequest = JSON.parse(propertyRequests);
      const oPropertyRequest = propertyRequests;
      oPropertyRequest.media =
        oPropertyRequest &&
        oPropertyRequest !== null &&
        Object.keys(oPropertyRequest).length > 0 &&
        oPropertyRequest.media &&
        oPropertyRequest.media !== null
          ? oPropertyRequest.media
          : {};
      let imagesMeta = [];
      if (images.length > 0) {
        const uploads = await this.BroadcastService.BroadcastFileUpload(
          images,
          KAFKA_FILE_UPLOADS_TOPIC.upload_files,
          'properties',
        );
        console.log(uploads);
        oPropertyRequest.media['images'] =
          uploads && uploads.filesUrls ? uploads.filesUrls : [];
        imagesMeta = uploads.metadata;
      }
      const oRequestbody = {
        oPropertyRequest,
        imagesMeta,
      };
      const result = await this.propertiesService.updateProperty(
        id,
        oRequestbody,
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
  @UseGuards(AdminJwtAuthGuard)
  async getAllPropertyLists(@Res() res: Response, @Req() req: Request) {
    try {
      const admin: AdminJWTPayload = req['admin'];
      const result = await this.propertiesService.getAllPropertyLists(admin);
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

  @Get('autocomplete')
  async autocomplete(@Query('query') query: string, @Res() res: Response) {
    const result = await this.propertiesService.searchAutocomplete(query);
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
      size,
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
    this.propertiesClient.subscribeToResponseOf('test-uploads');
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_ELASTIC_SEARCH_TOPIC.searchAutocomplete,
    );
    this.propertiesClient.subscribeToResponseOf(
      KAFKA_ELASTIC_SEARCH_TOPIC.search,
    );
    this.uploadsClient.subscribeToResponseOf(
      KAFKA_FILE_UPLOADS_TOPIC.upload_files,
    );
  }
}
