export const CLIENTS_MODULE_KAFKA_NAME_PROPERTY = {
  PROPERTIES_SERVICE: 'PROPERTIES_SERVICE',
  PROJECTS_SERVICE: 'PROJECTS_SERVICE',
  DEVELOPERS_SERVICE: 'DEVELOPERS_SERVICE',
  LOCATIONS_SERVICE: 'LOCATIONS_SERVICE',
};

export const KAFKA_CONSUMER_GROUP_ID = {
  properties_consumer: 'properties-consumer',
  projects_consumer: 'projects-consumer',
  developers_consumer: 'developers-consumer',
  locations_consumer: 'locations-consumer',
};

export const KAFKA_OPTIONS_CLIENT_ID = {
  properties_service: 'properties-service',
  projects_service: 'projects-service',
  developers_service: 'developers-service',
  locations_service: 'locations-service',
};

export const KAFKA_PROPERTIES_TOPIC = {
  add_properties: 'add_properties',
  update_properties: 'update_properties',
  retrieve_properties: 'retrieve_properties',
  delete_properties: 'delete_properties',
  update_property_status: 'update_property_status',
};

export const KAFKA_LOCATIONS_TOPIC = {
  locations_autocomplete: 'locations_autocomplete',
  restricted_location_auto_complete: 'restricted_location_auto_complete',
  retrieve_locations: 'retrieve_locations',
  locations_details: 'locations_details',
  locations_geocode: 'locations_geocode',
};

export const KAFKA_PROJECTS_TOPIC = {
  add_project: 'add_project',
  update_project: 'update_project',
  retrieve_projects: 'retrieve_projects',
  delete_project: 'delete_project',
};

export const KAFKA_DEVELOPERS_TOPIC = {
  add_developer: 'add_developer',
  update_developer: 'update_developer',
  retrieve_developers: 'retrieve_developers',
  delete_developer: 'delete_developer',
};
