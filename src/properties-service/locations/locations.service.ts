import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_LOCATIONS_TOPIC,
} from 'src/utils/constants/kafka-const';

@Injectable()
export class LocationService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private locationsClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAutocomplete(input: string) {
    try {
      const responseAutoCompleteLocations = this.locationsClient
        .send(KAFKA_LOCATIONS_TOPIC.locations_autocomplete, input)
        .toPromise();
      return responseAutoCompleteLocations;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async getLocationRestrictedAutoComplete(
    input: string,
    latitude: number,
    longitude: number,
  ) {
    try {
      const aRestrictionAttributes = {
        input: input,
        latitude: latitude,
        longitude: longitude,
      };
      const responseRestrictedAutoComplete = this.locationsClient
        .send(
          KAFKA_LOCATIONS_TOPIC.restricted_location_auto_complete,
          aRestrictionAttributes,
        )
        .toPromise();
      return responseRestrictedAutoComplete;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async getAllLocations() {
    try {
      const responseLocations = this.locationsClient
        .send(KAFKA_LOCATIONS_TOPIC.retrieve_locations, {})
        .toPromise();
      return responseLocations;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async getPlaceDetails(placeId: string) {
    try {
      const responsePlaceDetails = this.locationsClient
        .send(KAFKA_LOCATIONS_TOPIC.locations_details, placeId)
        .toPromise();
      return responsePlaceDetails;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async getGeocodeResponse(place: string) {
    try {
      const responseGoeCode = this.locationsClient
        .send(KAFKA_LOCATIONS_TOPIC.locations_geocode, place)
        .toPromise();
      return responseGoeCode;
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
