import { Schema } from "mongoose";

export class GetUserDetailsRequest {
    constructor(
        public readonly userId: Schema.Types.ObjectId,
    ) { }

    toString() {
        return JSON.stringify({
            userId: this.userId,
        });
    }
}
