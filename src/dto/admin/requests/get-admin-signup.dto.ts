export class GetAdminSignupRequest {
    constructor(
      public readonly email: string,
      public readonly password: string,
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly isSuperAdmin: boolean,
      public readonly role: string
    ) {}
  
    toString() {
      return JSON.stringify({
        email: this.email,
        password: this.password,
        firstName: this?.firstName,
        lastName: this?.lastName,
        isSuperAdmin: this?.isSuperAdmin,
        role: this.role
      });
    }
  }
  