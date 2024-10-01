import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROJECTS_TOPIC,
} from 'src/utils/constants/kafka-const';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private projectsService: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async addNewProjectByAdmin(oProjectRequest: any) {
    try {
      const responseProjects = this.projectsService
        .send(KAFKA_PROJECTS_TOPIC.add_project, oProjectRequest)
        .toPromise();
      return responseProjects;
    } catch (e) {
      throw e;
    }
  }

  async updateProjectByAdmin(id: string, data: any) {
    try {
      const oUpdateProjects = {
        id: id,
        data: data,
      };
      const responseProjects = this.projectsService
        .send(KAFKA_PROJECTS_TOPIC.update_project, oUpdateProjects)
        .toPromise();
      return responseProjects;
    } catch (e) {
      throw e;
    }
  }

  async getAllProjects() {
    try {
      const responseProjects = this.projectsService
        .send(KAFKA_PROJECTS_TOPIC.retrieve_projects, {})
        .toPromise();
      return responseProjects;
    } catch (e) {
      throw e;
    }
  }

  async deleteProjectFromList(id: string) {
    try {
      const responseProjects = this.projectsService
        .send(KAFKA_PROJECTS_TOPIC.delete_project, id)
        .toPromise();
      return responseProjects;
    } catch (e) {
      throw e;
    }
  }
}
