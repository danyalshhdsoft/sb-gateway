import { Types } from "mongoose";

export class CreateRegistrationRequest {
    constructor(
      public readonly email: string,
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly password: string,
      public readonly phone: string,
      public readonly whatsAppPhone: string,
      public readonly profilePicUrl: string,
      public readonly gender: string,
      public readonly country: Types.ObjectId,
      public readonly roleType: Types.ObjectId,
      public readonly agentDescription: string,
      public readonly developerId: Types.ObjectId,
      public readonly serviceArea: Types.ObjectId
    ) {}
  
    toString() {
      return JSON.stringify({
        email: this.email,
        firstName: this.firstName,
        password: this.password,
        lastName: this.lastName,
        phone: this.phone,
        whatsAppPhone: this.whatsAppPhone,
        profilePicUrl: this.profilePicUrl,
        gender: this.gender,
        country: this.country,
        roleType: this.roleType,
        agentDescription: this.agentDescription,
        developerId: this.developerId,
        serviceArea: this.serviceArea
      });
    }
  }
  