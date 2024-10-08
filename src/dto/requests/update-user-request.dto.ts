import { Schema, Types } from "mongoose";

export class UpdateUserRequest {
    constructor(
      public readonly userId: Schema.Types.ObjectId,
      public readonly email: string,
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly phone: string,
      public readonly whatsAppPhone: string,
      public readonly profilePicUrl: string,
      public readonly gender: string,
      public readonly country: Types.ObjectId,
    ) {}
  
    toString() {
      return JSON.stringify({
        userId: this.userId,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        whatsAppPhone: this.whatsAppPhone,
        profilePicUrl: this.profilePicUrl,
        gender: this.gender,
        country: this.country,
      });
    }
  }
  