import mongoose from "mongoose";

export class CreateAdminRoleRequest {
    constructor(
        public readonly name: string,
        public readonly permissions: any,
    ) { }

    toString() {
        return JSON.stringify({
            name: this.name,
            permissions: this.permissions,
        });
    }
}
