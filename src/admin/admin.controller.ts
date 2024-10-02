import { Body, Controller, Get, Inject, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
// import { AppService } from './app.service';
// import { CreateOrderRequest } from './create-order-request.dto';
// import { LoginDto, RegisterUserDto } from './dto/loginDto';
import { Response } from 'express';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { AdminSigninDto, AdminSignupDto } from 'src/dto/admin/admin.auth.dto';
import ApiResponse from 'src/utils/api-response.util';
import { AdminService } from './admin.service';
import { IsIdDTO } from 'src/dto/admin/id.dto';
import { UpdateRoleDto } from 'src/dto/admin/update.role.dto';
import { CreateRoleDto } from 'src/dto/admin/create-role.dto';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt-auth.guard';
import { EVENT_TOPICS } from 'src/enums/event-topics.enum';

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
    async adminSignin(
        @Body() adminLoginDto: AdminSigninDto,
        @Res() response: Response,
    ) {
       try {
            const res: any = await this.adminService.signIn(adminLoginDto);
            return res ? response.status(res?.status).send(res.data) : null;
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
    async adminSignup(
        @Body() adminSigninDto: AdminSignupDto,
        @Res() res: Response,
    ) {
        console.log('coming here');
        const user = await this.adminService.signup(adminSigninDto);
        return res.status(user.status).send(user.data);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Put('role')
    async updateRole(
      @Query() isIdDTO: IsIdDTO,
      @Body() updateRole: UpdateRoleDto,
      @Res() res: Response
    ) {
      const role = await this.adminService.updateRole(isIdDTO, updateRole);
      return role ? res.sendStatus(role.status).send(role.data) : null;
    }

    @UseGuards(AdminJwtAuthGuard)
    @Post('role')
    async createRole(@Body() createRoleDTO: CreateRoleDto) {
      const role = await this.adminService.createRole(createRoleDTO.name, createRoleDTO.permissions);
      return new ApiResponse(role, 'Role created successfully!');
    }
  
    @Get('role')
    async getRoles(
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
      return this.adminService.getRoles(page, limit);
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

    onModuleInit() {
        this.adminClient.subscribeToResponseOf(EVENT_TOPICS.ADMIN_LOGIN);
        this.adminClient.subscribeToResponseOf(EVENT_TOPICS.ADMIN_SIGNUP);
        this.adminClient.subscribeToResponseOf(EVENT_TOPICS.ADMIN_CREATE_ROLE);
        this.adminClient.subscribeToResponseOf(EVENT_TOPICS.ADMIN_UPDATE_ROLE);
        this.adminClient.subscribeToResponseOf(EVENT_TOPICS.ADMIN_GET_ROLES);
    }
}
