import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateOrderRequest } from './create-order-request.dto';
import { OrderCreatedEvent } from './order-created.event';
import { LoginDto, RegisterUserDto, ResetPasswordDto } from './dto/loginDto';
import { GetUserRequest } from './dto/requests/get-user-request.dto';
import { CreateRegistrationRequest } from './dto/requests/create-registration-request';
import { GetForgotPasswordRequest } from './dto/requests/get-forgot-password-request';
import { Schema } from 'mongoose';
import { CreateResetPasswordRequest } from './dto/requests/create-reset-password-request';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly billingClient: ClientKafka,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createOrder({ userId, price }: CreateOrderRequest) {
    this.billingClient.emit(
      'order_created',
      new OrderCreatedEvent('123', userId, price),
    );
  }

  async signIn(login: LoginDto) {
    return await this.authClient
      .send('login', new GetUserRequest(login.email, login.password))
      .toPromise()
      .catch(err => err);
  }

  async forgotPasswordRequest(email: string) {
    return await this.authClient
      .send('forgot-password', new GetForgotPasswordRequest(email))
      .toPromise()
      .catch(err => err);
  }

  async registerUser(user: RegisterUserDto) {
    return await this.authClient
      .send('register', new CreateRegistrationRequest(
        user.email,
        user.firstName,
        user.lastName,
        user.password,
        user.profilePicUrl,
        user.phone,
        user.whatsAppPhone,
        user.gender,
        user.country,
        user.roleType,
        user.agentDescription,
        user.developerId,
        user.serviceArea,
      )).toPromise()
      .catch(err => err);
  }

  async resetPassword(password: string, userId: Schema.Types.ObjectId) {
    return await this.authClient
      .send('reset-password', new CreateResetPasswordRequest(
        password,
        userId,
      )).toPromise()
      .catch(err => err);
  }
}
