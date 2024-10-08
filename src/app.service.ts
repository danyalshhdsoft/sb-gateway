import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateOrderRequest } from './create-order-request.dto';
import { OrderCreatedEvent } from './order-created.event';
import { LoginDto, RegisterUserDto, ResetPasswordDto, UpdateUserDto } from './dto/loginDto';
import { GetUserRequest } from './dto/requests/get-user-request.dto';
import { CreateRegistrationRequest } from './dto/requests/create-registration-request';
import { GetForgotPasswordRequest } from './dto/requests/get-forgot-password-request';
import { Schema } from 'mongoose';
import { CreateResetPasswordRequest } from './dto/requests/create-reset-password-request';
import { OnboardingVerifyRequest } from './dto/requests/onboarding-verify-request';
import { EVENT_TOPICS } from './enums/event-topics.enum';
import { SERVICE_TYPES } from './enums/service-types.enum';
import { GetUserDetailsRequest } from './dto/requests/get-user-details-request';
import { UpdateUserRequest } from './dto/requests/update-user-request.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(SERVICE_TYPES.USER_SERVICE) private readonly billingClient: ClientKafka,
    @Inject(SERVICE_TYPES.AUTH_SERVICE) private readonly authClient: ClientKafka,
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
      .send(EVENT_TOPICS.LOGIN, new GetUserRequest(login.email, login.password))
      .toPromise()
      .catch(err => err);
  }

  async forgotPasswordRequest(email: string) {
    return await this.authClient
      .send(EVENT_TOPICS.FORGOT_PASSWORD, new GetForgotPasswordRequest(email))
      .toPromise()
      .catch(err => err);
  }

  async registerUser(user: RegisterUserDto) {
    return await this.authClient
      .send(EVENT_TOPICS.REGISTER, new CreateRegistrationRequest(
        user.email,
        user.firstName,
        user.lastName,
        user.password,
        user.phone,
        user.profilePicUrl,
        user.whatsAppPhone,
        user.gender,
        user.country,
        user.agentDescription,
        user.developerId,
        user.serviceArea,
      )).toPromise()
      .catch(err => err);
  }

  async resetPassword(password: string, userId: Schema.Types.ObjectId) {
    return await this.authClient
      .send(EVENT_TOPICS.RESET_PASSWORD, new CreateResetPasswordRequest(
        password,
        userId,
      )).toPromise()
      .catch(err => err);
  }

  async verifyEmail(otp: string, userId: Schema.Types.ObjectId) {
    return await this.authClient
      .send(EVENT_TOPICS.ONBOARDING_VERIFY, new OnboardingVerifyRequest(
        otp,
        userId,
      )).toPromise()
      .catch(err => err);
  }

  async getUser(userId: Schema.Types.ObjectId) {
    return await this.authClient
      .send(EVENT_TOPICS.GET_USER_DETAILS, new GetUserDetailsRequest(
        userId,
      )).toPromise()
      .catch(err => err);
  }

  async getCountries() {
    return await this.authClient
      .send(EVENT_TOPICS.GET_COUNTRIES, {})
      .toPromise()
      .catch(err => err);
  }

  async updateUser(
    userId: Schema.Types.ObjectId,
    updateUserDto: UpdateUserDto
  ) {
    return await this.authClient
      .send(EVENT_TOPICS.UPDATE_USER, new UpdateUserRequest(
        userId,
        updateUserDto.email,
        updateUserDto.firstName,
        updateUserDto.lastName,
        updateUserDto.profilePicUrl,
        updateUserDto.phone,
        updateUserDto.whatsAppPhone,
        updateUserDto.gender,
        updateUserDto.country,
      ))
      .toPromise()
      .catch(err => err);
  }
}
