import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { AdminSignupDto } from 'src/dto/admin/admin.auth.dto';
import { CreateAgencyRequestDto, RegisterAgencyRequestDto } from 'src/dto/admin/agency.dto';
import { IsIdDTO } from 'src/dto/admin/id.dto';
import { CreateAdminRoleRequest } from 'src/dto/admin/requests/create-admin-role-request.dto';
import { CreateAgencyRequest } from 'src/dto/admin/requests/create-agency-request.dto';
import { CreateSuperAdminRequest } from 'src/dto/admin/requests/create-super-admin-request.dto';
import { DeleteAgencyRequest } from 'src/dto/admin/requests/delete-agency.dto';
import { GetAdminRequest } from 'src/dto/admin/requests/get-admin-request.dto';
import { GetAdminRolesRequest } from 'src/dto/admin/requests/get-admin-roles-request.dto';
import { RegisterAgencyQueryRequest } from 'src/dto/admin/requests/get-admin-signup.dto';
import { UpdateAdminRoleRequest } from 'src/dto/admin/requests/update-admin-role-request.dto';
import { PermissionDTO, UpdateRoleDto } from 'src/dto/admin/update.role.dto';
import { LoginDto } from 'src/dto/loginDto';
import { EVENT_TOPICS } from 'src/enums/event-topics.enum';
import ApiResponse from 'src/utils/api-response.util';

@Injectable()
export class AdminService {
    constructor(
        @Inject('ADMIN_SERVICE') private readonly adminClient: ClientKafka,
    ) { }

    async signIn(login: LoginDto) {
        return await this.adminClient
            .send(EVENT_TOPICS.ADMIN_LOGIN, new GetAdminRequest(login.email, login.password))
            .toPromise()
            .catch(err => err);
    }

    async registerAgencyQuery(registerAgencyRequestDTO: RegisterAgencyRequestDto) {
        return await this.adminClient
            .send(EVENT_TOPICS.REGISTER_AGENCY_QUERY, new RegisterAgencyQueryRequest(
                registerAgencyRequestDTO.email,
                registerAgencyRequestDTO.password,
                registerAgencyRequestDTO.firstName,
                registerAgencyRequestDTO.lastName,
                registerAgencyRequestDTO.companyName,
                registerAgencyRequestDTO.phone
            )).toPromise()
            .catch(err => err);
    }

    async updateRole(isIdDto: IsIdDTO, updateRoleDTO: UpdateRoleDto) {
        return await this.adminClient
            .send(EVENT_TOPICS.ADMIN_UPDATE_ROLE, new UpdateAdminRoleRequest(
                isIdDto.id,
                updateRoleDTO,
            )).toPromise()
            .catch(err => err);
    }

    async createRole(name: string, permissions: any) {
        return await this.adminClient
            .send(EVENT_TOPICS.ADMIN_CREATE_ROLE, new CreateAdminRoleRequest(
                name,
                permissions,
            )).toPromise()
            .catch(err => err);
    }

    async getRoles(page: string, limit: string) {
        return await this.adminClient
            .send(EVENT_TOPICS.ADMIN_GET_ROLES, new GetAdminRolesRequest(
                page,
                limit,
            )).toPromise()
            .catch(err => err);
    }

    async createAgency(createAgencyDto: CreateAgencyRequestDto) {
        return await this.adminClient
            .send(EVENT_TOPICS.CREATE_AGENCY, new CreateAgencyRequest(
                createAgencyDto.email,
                createAgencyDto.firstName,
                createAgencyDto.lastName,
                createAgencyDto.companyName,
                createAgencyDto.phone,
                createAgencyDto.password
            )).toPromise()
            .catch(err => err);
    }

    async createSuperAdmin(createAgencyDto: AdminSignupDto) {
        return await this.adminClient
            .send(EVENT_TOPICS.CREATE_AGENCY, new CreateSuperAdminRequest(
                createAgencyDto.email,
                createAgencyDto.password,
                createAgencyDto.firstName,
                createAgencyDto.lastName,
                createAgencyDto.isSuperAdmin,
                createAgencyDto.role
            )).toPromise()
            .catch(err => err);
    }

    async updateAgency(updateAgencyDto: CreateAgencyRequestDto) {
        return await this.adminClient
            .send(EVENT_TOPICS.UPDATE_AGENCY, new CreateAgencyRequest(
                updateAgencyDto.email,
                updateAgencyDto.firstName,
                updateAgencyDto.lastName,
                updateAgencyDto.companyName,
                updateAgencyDto.phone,
                updateAgencyDto.password
            )).toPromise()
            .catch(err => err);
    }

    async deleteAgency(deleteAgencyDto: IsIdDTO) {
        return await this.adminClient
            .send(EVENT_TOPICS.DELETE_AGENCY, new DeleteAgencyRequest(
                deleteAgencyDto.id,
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
