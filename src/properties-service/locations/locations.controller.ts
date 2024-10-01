import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Res,
  Query,
} from '@nestjs/common';
import { LocationService } from './locations.service';

import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_LOCATIONS_TOPIC,
} from 'src/utils/constants/kafka-const';
import { Response } from 'express';
import { catchException } from 'src/utils/helper/handle.exceptionh.helper';

@Controller('locations')
export class LocationsController implements OnModuleInit {
  constructor(
    private readonly locationsService: LocationService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.PROPERTIES_SERVICE)
    private locationsClient: ClientKafka,
  ) {}

  // Endpoint for autocomplete search box
  @Get('autocomplete')
  async getAutocomplete(@Query('input') input: string, @Res() res: Response) {
    try {
      const response = await this.locationsService.getAutocomplete(input);
      const data = {
        message: response.message,
        data: response.data,
      };
      return res.status(response.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  // Endpoint for restricted autocomplete search box
  @Get('restricted-location-auto-complete')
  async getLocationRestrictedAutoComplete(
    @Query('input') input: string,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Res() res: Response,
  ) {
    try {
      const response =
        await this.locationsService.getLocationRestrictedAutoComplete(
          input,
          latitude,
          longitude,
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
  async getAllLocations(@Res() res: Response) {
    try {
      const response = await this.locationsService.getAllLocations();
      const data = {
        message: response.message,
        data: response.data,
      };
      return res.status(response.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  // Endpoint for fetching place details
  @Get('details')
  async getPlaceDetails(
    @Query('placeId') placeId: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.locationsService.getPlaceDetails(placeId);

      // Optional: Enrich with developer/project details from external data
      // const additionalDetails = await this.LocationsService.getDeveloperDetails(
      //   placeDetails.address,
      // );
      const data = {
        message: response.message,
        data: response.data,
      };
      return res.status(response.status).send(data);
    } catch (oError) {
      catchException(oError);
    }
  }

  // Endpoint for autocomplete search box
  @Get('geocode')
  async getGeocode(@Query('input') input: string, @Res() res: Response) {
    try {
      const response = await this.locationsService.getGeocodeResponse(input);
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
    this.locationsClient.subscribeToResponseOf(
      KAFKA_LOCATIONS_TOPIC.locations_autocomplete,
    );
    this.locationsClient.subscribeToResponseOf(
      KAFKA_LOCATIONS_TOPIC.restricted_location_auto_complete,
    );
    this.locationsClient.subscribeToResponseOf(
      KAFKA_LOCATIONS_TOPIC.retrieve_locations,
    );
    this.locationsClient.subscribeToResponseOf(
      KAFKA_LOCATIONS_TOPIC.locations_details,
    );
    this.locationsClient.subscribeToResponseOf(
      KAFKA_LOCATIONS_TOPIC.locations_geocode,
    );
  }
}
