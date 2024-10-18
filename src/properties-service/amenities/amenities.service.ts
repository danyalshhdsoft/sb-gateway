import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_AMENITIES_TOPIC,
} from 'src/utils/constants/kafka-const';

@Injectable()
export class AmenitiesService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private amenitiesClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllAmenities() {
    try {
      const responseAmenities = this.amenitiesClient
        .send(KAFKA_AMENITIES_TOPIC.retrieve_amenities, {})
        .toPromise();
      return responseAmenities;
    } catch (e) {
      throw e;
    }
  }
}
