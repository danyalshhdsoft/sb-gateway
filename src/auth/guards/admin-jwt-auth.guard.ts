import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { ClientKafka } from '@nestjs/microservices';
import { AuthPayload } from 'src/dto/requests/auth-payload';
import { PERMISSION } from 'src/enums/permission';
import { checkExistence } from 'src/utils/helpers';
import { ADMIN_ACCOUNT_STATUS } from 'src/enums/admin.account.status.enum';
import { AdminJWTPayload } from 'src/interface/admin-jwt-payload';
import { JWT_SECRET_ADMIN } from 'src/utils/constants';
import { SERVICE_TYPES } from 'src/enums/service-types.enum';
import { EVENT_TOPICS } from 'src/enums/event-topics.enum';

@Injectable()
export class AdminJwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private reflector: Reflector,
        @Inject(SERVICE_TYPES.ADMIN_SERVICE) private readonly adminClient: ClientKafka,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: any = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            console.log("using jwtservice");
            const payload: AdminJWTPayload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>(JWT_SECRET_ADMIN),
                },
            );

            if (!payload.isSuperAdmin) {
                request.admin = { id: payload.id, email: payload.email, role: payload.role };
                return true;
            }
            const adminRole = await this.adminClient
                .send(EVENT_TOPICS.ADMIN_GET_ROLE_BY_ID, new AuthPayload(payload.role))
                .toPromise()
                .catch(err => err);
            
            if (!adminRole) {
                throw new UnauthorizedException('Admin not found');
            }

            const checkPermission = this.reflector.get<PERMISSION[]>(
                'permission-check',
                context.getHandler(),
            );

            if (checkPermission) {
                const assignPermission = adminRole.permissions;
                const accessable_api_modules = this.reflector.get<PERMISSION[]>(
                    'permissions',
                    context.getHandler(),
                );
                const hasPermission = checkExistence(
                    assignPermission,
                    accessable_api_modules,
                );

                if (!hasPermission) {
                    throw new UnauthorizedException('Permission denied');
                }
            }
            request.admin = { id: payload.id, email: payload.email, role: payload.role };
        } catch (e) {
            console.log(e);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
