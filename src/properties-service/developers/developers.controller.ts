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
import { DevelopersService } from './developers.service';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_DEVELOPERS_TOPIC,
} from 'src/utils/constants/kafka-const';
import { Response } from 'express';
import { catchException } from 'src/utils/helper/handle.exceptionh.helper';

@Controller('developers')
export class DevelopersController implements OnModuleInit {
  constructor(
    private readonly developersService: DevelopersService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private developerssClient: ClientKafka,
  ) {}

  @Post('add-developer')
  async addNewDeveloperByAdmin(
    @Body() developerRequests: any,
    @Res() res: Response,
  ) {
    try {
      const response = await this.developersService.addNewDeveloperByAdmin(
        developerRequests,
      );
      const data = {
        message: response.message,
        data: response.data,
      };
      return res.status(response.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  @Put(':id')
  async updateDeveloperByAdmin(
    @Param('id') id: string,
    @Body() developerRequests: any,
    @Res() res: Response,
  ) {
    try {
      const response = await this.developersService.updateDeveloperByAdmin(
        id,
        developerRequests,
      );
      const data = {
        message: response.message,
        data: response.data,
      };
      return res.status(response.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  @Get()
  async getAllDevelopers(@Res() res: Response) {
    try {
      const response = await this.developersService.getAllDevelopers();
      const data = {
        message: response.message,
        data: response.data,
      };
      return res.status(response.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  @Delete(':id')
  async deleteDeveloperFromList(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.developersService.deleteDeveloperFromList(id);
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
    this.developerssClient.subscribeToResponseOf(
      KAFKA_DEVELOPERS_TOPIC.add_developer,
    );
    this.developerssClient.subscribeToResponseOf(
      KAFKA_DEVELOPERS_TOPIC.update_developer,
    );
    this.developerssClient.subscribeToResponseOf(
      KAFKA_DEVELOPERS_TOPIC.retrieve_developers,
    );
    this.developerssClient.subscribeToResponseOf(
      KAFKA_DEVELOPERS_TOPIC.delete_developer,
    );
  }
}
