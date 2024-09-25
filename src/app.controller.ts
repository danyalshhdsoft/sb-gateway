import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderRequest } from './create-order-request.dto';
import { LoginDto, RegisterUserDto } from './dto/loginDto';
import { Response } from 'express';
import { ClientKafka } from '@nestjs/microservices';
import { ResetPasswordDto, ResetPasswordRequestDto } from './dto/auth.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import ApiResponse from './utils/api-response.util';

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
    @Res() response: Response
  ) {
    const res: any = await this.appService.forgotPasswordRequest(resetPasswordDto.email);
    return res ? response.status(res?.status).send(res.data) : null;
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: any,
    @Res() response: Response
  ) {
    const res: any = await this.appService.resetPassword(
      resetPasswordDto.password,
      req.user.id
    );
    return res ? response.status(res?.status).send(res.data) : null;
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
    this.authClient.subscribeToResponseOf('reset-password');
    this.authClient.subscribeToResponseOf('authorize_user');
  }
}
