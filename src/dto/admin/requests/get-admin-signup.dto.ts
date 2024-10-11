export class RegisterAgencyQueryRequest {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly companyName: string,
    public readonly phone: string,
  ) { }

  toString() {
    return JSON.stringify({
      email: this.email,
      password: this.password,
      firstName: this?.firstName,
      companyName: this?.companyName,
      lastName: this?.lastName,
      phone: this?.phone
    });
  }
}
