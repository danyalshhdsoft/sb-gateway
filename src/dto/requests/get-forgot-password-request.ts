export class GetForgotPasswordRequest {
    constructor(
      public readonly email: string,
    ) {}
  
    toString() {
      return JSON.stringify({
        email: this.email,
      });
    }
  }
  