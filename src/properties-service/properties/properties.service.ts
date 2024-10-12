import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { SearchPropertiesQueryRequest } from 'src/dto/properties/requests/search-properties-query-request.dto';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_ELASTIC_SEARCH_TOPIC,
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
      const responseProperties = await this.propertiesClient
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

  async searchAutocomplete(query: string) {
    try {
      const responseProperties = this.propertiesClient
        .send(KAFKA_ELASTIC_SEARCH_TOPIC.searchAutocomplete, query)
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async searchProperties(
    query: string,
    bedroom: string,
    washroom: string,
    purpose: string,
    status: string,
    completionStatus: string,
    propertyType: string,
    minPrice: string,
    maxPrice: string,
    from: string,
    size: string,
  ) {
    try {
      const responseProperties = await this.propertiesClient
        .send(
          KAFKA_ELASTIC_SEARCH_TOPIC.search,
          new SearchPropertiesQueryRequest(
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
          ),
        )
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
