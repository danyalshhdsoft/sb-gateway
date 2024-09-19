import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
// import { AppService } from './app.service';
// import { CreateOrderRequest } from './create-order-request.dto';
// import { LoginDto, RegisterUserDto } from './dto/loginDto';
import { Response } from 'express';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { AdminSigninDto, AdminSignupDto } from 'src/dto/admin/admin.auth.dto';
import ApiResponse from 'src/utils/api-response.util';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        @Inject('ADMIN_SERVICE') private readonly adminClient: ClientKafka,
    ) { }

    @Get()
    getHello(): string {
        return "hello from admin";
    }

    @Post('signin')
    async adminSignin(@Body() adminLoginDto: AdminSigninDto) {
        try {
            return new ApiResponse(await this.adminService.signIn(adminLoginDto));
        } catch (error) {
            if (error instanceof RpcException) {
                const errResponse = error.getError();
                // Do something with the error (log it, transform it, etc.)
                throw new RpcException(errResponse);
            }
            throw new RpcException('Unknown error');
        }
    }

    @Post('signup')
    async adminSignup(@Body() adminSigninDto: AdminSignupDto) {
        return new ApiResponse(await this.adminService.signup(adminSigninDto));
    }

    //   @Post('forgot-password/request')
    //   async forgotPasswordRequest(@Body()  forogtPasswordRequestDto: ForgotPasswordRequestDto) {
    //     return await this.adminService.forgotPasswordRequest(forogtPasswordRequestDto.email);
    //   }
    //   @Post('forgot-password')
    //   async forgotPassword(@Body() forogtPasswordDto: ForgotPasswordDto) {
    //     return await this.adminService.forgotPassword(forogtPasswordDto.token, forogtPasswordDto.newPassword , forogtPasswordDto.confirmPassword);
    //   }

    //   @Post()
    //   createOrder(@Body() createOrderRequest: CreateOrderRequest) {
    //     this.appService.createOrder(createOrderRequest);
    //     return "created succesfuly";
    //   }

    //   @Post('signin')
    //   async signIn(@Body() loginDto: LoginDto, @Res() response: Response) {
    //     const res: any = await this.appService.signIn(loginDto);
    //     return res ? response.status(res?.status).send(res.data) : null;
    //   }

    //   @Post('signup')
    //   async create(@Body() createUserDto: RegisterUserDto, @Res() response: Response) {
    //     const res: any = await this.appService.registerUser(createUserDto);
    //     return res ? response.status(res?.status).send(res.data) : null;
    //   }

    onModuleInit() {
        this.adminClient.subscribeToResponseOf('admin_login');
        this.adminClient.subscribeToResponseOf('admin_signup');
    }
}
