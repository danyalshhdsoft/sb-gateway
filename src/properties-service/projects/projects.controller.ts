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
import { ProjectsService } from './projects.service';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROJECTS_TOPIC,
} from 'src/utils/constants/kafka-const';
import { Response } from 'express';
import { catchException } from 'src/utils/helper/handle.exceptionh.helper';

@Controller('projects')
export class ProjectsController implements OnModuleInit {
  constructor(
    private readonly projectsService: ProjectsService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private projectsClient: ClientKafka,
  ) {}

  @Post('add-project')
  async addNewProjectByAdmin(
    @Body() projectRequests: any,
    @Res() res: Response,
  ) {
    try {
      const response = await this.projectsService.addNewProjectByAdmin(
        projectRequests,
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
  async updateProjectByAdmin(
    @Param('id') id: string,
    @Body() projectRequests: any,
    @Res() res: Response,
  ) {
    try {
      const response = await this.projectsService.updateProjectByAdmin(
        id,
        projectRequests,
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
  async getAllProjects(@Res() res: Response) {
    try {
      const response = await this.projectsService.getAllProjects();
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
  async deleteProjectFromList(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.projectsService.deleteProjectFromList(id);
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
    this.projectsClient.subscribeToResponseOf(KAFKA_PROJECTS_TOPIC.add_project);
    this.projectsClient.subscribeToResponseOf(
      KAFKA_PROJECTS_TOPIC.update_project,
    );
    this.projectsClient.subscribeToResponseOf(
      KAFKA_PROJECTS_TOPIC.retrieve_projects,
    );
    this.projectsClient.subscribeToResponseOf(
      KAFKA_PROJECTS_TOPIC.delete_project,
    );
  }
}
