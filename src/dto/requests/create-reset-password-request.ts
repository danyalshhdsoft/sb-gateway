import { Schema, Types } from "mongoose";

export class CreateResetPasswordRequest {
    constructor(
        public readonly password: string,
        public readonly userId: Schema.Types.ObjectId,
    ) { }

    toString() {
        return JSON.stringify({
            password: this.password,
            userId: this.userId,
        });
    }
}
