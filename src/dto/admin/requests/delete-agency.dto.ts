import mongoose from "mongoose";

export class DeleteAgencyRequest {
    constructor(
        public readonly id: mongoose.Types.ObjectId,
    ) { }

    toString() {
        return JSON.stringify({
            id: this.id,
        });
    }
}
