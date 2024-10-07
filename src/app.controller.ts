import { Body, Controller, Get, Inject, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto, RegisterUserDto, VerifyEmailDto } from './dto/loginDto';
import { Response } from 'express';
import { ClientKafka } from '@nestjs/microservices';
import { ResetPasswordDto, ResetPasswordRequestDto } from './dto/auth.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { EVENT_TOPICS } from './enums/event-topics.enum';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(
    @Req() req: any,
    @Res() response: Response
  ) {
    const user: any = await this.appService.getUser(req.user.id);
    return response.status(user.status).send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('user')
  async updateUser(
    @Req() req: any,
    @Body() updateUserDto: RegisterUserDto,
    @Res() response: Response
  ) {
    const user: any = await this.appService.updateUser(req.user.userId, updateUserDto);
    return response.status(user.status).send(user);
  }

  @Get('countries')
  async getCountries(
    @Req() req: any,
    @Res() response: Response
  ) {
    const countries: any = await this.appService.getCountries();
    return countries ? response.status(countries.status).send(countries) : response.send({});
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

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/verify')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Req() req: any,
    @Res() response: Response
  ) {
    //try {
    const res: any = await this.appService.verifyEmail(verifyEmailDto.otp, req.user.id);
    return res ? response.status(res?.status).send(res.data) : null;
    // }
    // catch (error) {
    //   if (error instanceof RpcException) {
    //     const errResponse = error.getError();
    //     // Do something with the error (log it, transform it, etc.)
    //     throw new NotFoundException(errResponse);
    //   }
    //   throw new BadRequestException(error.message);
    // }
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
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.LOGIN);
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.REGISTER);
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.FORGOT_PASSWORD);
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.RESET_PASSWORD);
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.AUTHORIZE_USER);
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.ONBOARDING_VERIFY);
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.GET_USER_DETAILS);
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.GET_COUNTRIES);
    this.authClient.subscribeToResponseOf(EVENT_TOPICS.UPDATE_USER);
  }
}
