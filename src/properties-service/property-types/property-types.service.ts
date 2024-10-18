import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROPERTY_TYPES_TOPIC,
} from 'src/utils/constants/kafka-const';

@Injectable()
export class PropertyTypesService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private propertyTypesClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllPropertyTypes() {
    try {
      const responsePropertyTypes = this.propertyTypesClient
        .send(KAFKA_PROPERTY_TYPES_TOPIC.retrieve_property_types, {})
        .toPromise();
      return responsePropertyTypes;
    } catch (e) {
      throw e;
    }
  }
}
