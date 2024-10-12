import { Inject, Injectable } from '@nestjs/common';
import { CLIENTS_MODULE_KAFKA_NAME_PROPERTY } from 'src/utils/constants/kafka-const';
import { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class BroadcastUploadsService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.UPLOADS_SERVICE)
    private uploadsClient: ClientKafka,
  ) {}

  async BroadcastFileUpload(files: any, topic: string, module: string) {
    try {
      const fileUploaded = await this.uploadsClient
        .send(topic, { files, module: module })
        .toPromise();
      return fileUploaded;
    } catch (oError) {
      throw oError;
    }
  }
}
