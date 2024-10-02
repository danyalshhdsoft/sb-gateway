import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AuthPayload } from 'src/dto/requests/auth-payload';
import { ClientKafka } from '@nestjs/microservices';
import { USER_TYPES } from 'src/enums/user-types';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET_ADMIN'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authClient
        .send('get_user', new AuthPayload(payload.sub))
        .toPromise()
        .catch(err => err);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
