import mongoose from "mongoose";

export class CreateAgencyRequest {
    constructor(
        public readonly email: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly companyName: string,
        public readonly phone: string,
        public readonly password: string,
    ) { }

    toString() {
        return JSON.stringify({
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            companyName: this.companyName,
            phone: this.phone,
            password: this.password
        });
    }
}
