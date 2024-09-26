import { Schema } from "mongoose";

export class OnboardingVerifyRequest {
    constructor(
        public readonly otp: string,
        public readonly userId: Schema.Types.ObjectId
    ) { }

    toString() {
        return JSON.stringify({
            otp: this.otp,
            userId: this.userId
        });
    }
}
