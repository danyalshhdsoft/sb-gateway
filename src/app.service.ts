import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateOrderRequest } from './create-order-request.dto';
import { OrderCreatedEvent } from './order-created.event';
import { LoginDto, RegisterUserDto } from './dto/loginDto';
import { GetUserRequest } from './dto/requests/get-user-request.dto';
import { CreateRegistrationRequest } from './dto/requests/create-registration-request';

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
    console.log("danyal testing in api gateway")
    this.billingClient.emit(
      'order_created',
      new OrderCreatedEvent('123', userId, price),
    );
  }

  async signIn(login: LoginDto) {
    return await this.authClient
      .send('login', new GetUserRequest(login.email, login.password)).toPromise();
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
      )).toPromise();
  }
}
