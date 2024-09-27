import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreatePropertyRequest } from 'src/dto/properties/requests/create-properties-request.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @Inject('PROPERTIES_SERVICE') private propertiesClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async addNewProperty(oPropertyRequest: CreatePropertyRequest) {
    try {
      const responseProperties = this.propertiesClient
        .send('add_properties', oPropertyRequest)
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async updateProperty(id: string, data: any) {
    try {
      const oUpdateProperty = {
        id: id,
        data: data,
      };
      const responseProperties = this.propertiesClient
        .send('update_properties', oUpdateProperty)
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async getAllPropertyLists() {
    try {
      const responseProperties = this.propertiesClient
        .send('retrieve_properties', {})
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async deletePropertyFromList(id: string) {
    try {
      const responseProperties = this.propertiesClient
        .send('delete_properties', id)
        .toPromise();
      return responseProperties;
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
