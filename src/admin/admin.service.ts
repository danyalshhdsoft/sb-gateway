import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { AdminSignupDto } from 'src/dto/admin/admin.auth.dto';
import { GetAdminRequest } from 'src/dto/admin/requests/get-admin-request.dto';
import { GetAdminSignupRequest } from 'src/dto/admin/requests/get-admin-signup.dto';
import { LoginDto } from 'src/dto/loginDto';

@Injectable()
export class AdminService {
  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientKafka,
  ) {}

  async signIn(login: LoginDto) {
    return await this.adminClient
      .send('admin_login', new GetAdminRequest(login.email, login.password))
      .toPromise()
      .catch(err => err);
  }

  async signup(adminSignupDTO: AdminSignupDto) {
    return await this.adminClient
      .send('admin_signup', new GetAdminSignupRequest(
        adminSignupDTO.email,
        adminSignupDTO.password,
        adminSignupDTO.firstName,
        adminSignupDTO.lastName,
        adminSignupDTO.isSuperAdmin,
        adminSignupDTO.role,
    )).toPromise()
    .catch(err => err);
  }

//   async registerUser(user: RegisterUserDto) {
//     return await this.adminClient
//       .send('admin_register', new CreateRegistrationRequest(
//         user.email,
//         user.firstName,
//         user.lastName,
//         user.password,
//         user.profilePicUrl,
//         user.phone,
//         user.whatsAppPhone,
//         user.gender,
//         user.country,
//         user.roleType,
//         user.agentDescription,
//         user.developerId,
//         user.serviceArea,
//       )).toPromise();
//   }
}
