import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Model } from 'mongoose';
import { AuthPayload } from 'src/dto/requests/auth-payload';
import { ClientKafka } from '@nestjs/microservices';
import { USER_TYPES } from 'src/enums/user-types';
import { EVENT_TOPICS } from 'src/enums/event-topics.enum';
import { SERVICE_TYPES } from 'src/enums/service-types.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  role?: mongoose.Types.ObjectId,
  isSuperAdmin: boolean
};

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    @Inject(SERVICE_TYPES.ADMIN_SERVICE) private readonly adminClient: ClientKafka,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET_ADMIN'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.adminClient
        .send(EVENT_TOPICS.GET_ADMIN, new AuthPayload(payload.sub))
        .toPromise()
        .catch(err => err);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      isSuperAdmin: payload.isSuperAdmin
    };
  }
}
