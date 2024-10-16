import mongoose from "mongoose";

export class CreateSuperAdminRequest {
    constructor(
        public readonly email: string,
        public readonly password: any,
        public readonly firstName: string,
        public readonly lastName: any,
        public readonly isSuperAdmin: boolean,
        public readonly role: any,

    ) { }

    toString() {
        return JSON.stringify({
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            isSuperAdmin: this.isSuperAdmin,
            role: this.role
        });
    }
}
