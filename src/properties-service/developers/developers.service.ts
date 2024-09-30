import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_DEVELOPERS_TOPIC,
} from 'src/utils/constants/kafka-const';

@Injectable()
export class DevelopersService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private developersService: ClientKafka,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async addNewDeveloperByAdmin(oDeveloperRequest: any) {
    try {
      const responseDevelopers = this.developersService
        .send(KAFKA_DEVELOPERS_TOPIC.add_developer, oDeveloperRequest)
        .toPromise();
      return responseDevelopers;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async updateDeveloperByAdmin(id: string, data: any) {
    try {
      const oUpdateProjects = {
        id: id,
        data: data,
      };
      const responseDevelopers = this.developersService
        .send(KAFKA_DEVELOPERS_TOPIC.update_developer, oUpdateProjects)
        .toPromise();
      return responseDevelopers;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async getAllDevelopers() {
    try {
      const responseDevelopers = this.developersService
        .send(KAFKA_DEVELOPERS_TOPIC.retrieve_developers, {})
        .toPromise();
      return responseDevelopers;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async deleteDeveloperFromList(id: string) {
    try {
      const responseDevelopers = this.developersService
        .send(KAFKA_DEVELOPERS_TOPIC.delete_developer, id)
        .toPromise();
      return responseDevelopers;
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
