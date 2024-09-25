import mongoose from "mongoose";

export class UpdateAdminRoleRequest {
    constructor(
        public readonly id: mongoose.Types.ObjectId,
        public readonly updateRoleDTO: any,
    ) { }

    toString() {
        return JSON.stringify({
            id: this.id,
            updateRoleDTO: this.updateRoleDTO,
        });
    }
}
