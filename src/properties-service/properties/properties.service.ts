import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROPERTIES_TOPIC,
} from 'src/utils/constants/kafka-const';

@Injectable()
export class PropertiesService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private propertiesClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async addNewProperty(oPropertyRequest: any) {
    try {
      const responseProperties = this.propertiesClient
        .send(KAFKA_PROPERTIES_TOPIC.add_properties, oPropertyRequest)
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw e;
    }
  }

  async updateProperty(id: string, data: any) {
    try {
      const oUpdateProperty = {
        id: id,
        data: data,
      };
      const responseProperties = this.propertiesClient
        .send(KAFKA_PROPERTIES_TOPIC.update_properties, oUpdateProperty)
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw e;
    }
  }

  async getAllPropertyLists() {
    try {
      const responseProperties = this.propertiesClient
        .send(KAFKA_PROPERTIES_TOPIC.retrieve_properties, {})
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw e;
    }
  }

  async deletePropertyFromList(id: string) {
    try {
      const responseProperties = this.propertiesClient
        .send(KAFKA_PROPERTIES_TOPIC.delete_properties, id)
        .toPromise();
      return responseProperties;
    } catch (oError) {
      throw oError;
    }
  }

  async PropertyStatusUpdate(id: string, data: any) {
    try {
      const oUpdateProperty = {
        id: id,
        data: data,
      };
      const responseProperties = this.propertiesClient
        .send(KAFKA_PROPERTIES_TOPIC.update_property_status, oUpdateProperty)
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw e;
    }
  }
}
