import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderRequest } from './create-order-request.dto';
import { LoginDto, RegisterUserDto } from './dto/loginDto';
import { Response } from 'express';
import { ClientKafka } from '@nestjs/microservices';
import { ResetPasswordRequestDto } from './dto/auth.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createOrder(@Body() createOrderRequest: CreateOrderRequest) {
    this.appService.createOrder(createOrderRequest);
    return "created succesfuly";
  }

  @Post('signin')
  async signIn(@Body() loginDto: LoginDto, @Res() response: Response) {
    const res: any = await this.appService.signIn(loginDto);
    return res ? response.status(res?.status).send(res.data) : null;
  }

  @Post('signup')
  async create(@Body() createUserDto: RegisterUserDto, @Res() response: Response) {
    const res: any = await this.appService.registerUser(createUserDto);
    return res ? response.status(res?.status).send(res.data) : null;
  }

  @Post('forgot-password')
  async requestForgotPassword(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
  ) {
    return await this.appService.forgotPasswordRequest(resetPasswordDto.email);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('reset-password')
  // async ressetPassword(
  //   @Body() resetPasswordDto: ResetPasswordDto,
  //   @Req() req: any,
  // ) {
  //   return await this.appService.resetPassword(
  //     resetPasswordDto.password,
  //     req.user.id,
  //   );
  // }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('login');
    this.authClient.subscribeToResponseOf('register');
    this.authClient.subscribeToResponseOf('forgot-password');
  }
}
