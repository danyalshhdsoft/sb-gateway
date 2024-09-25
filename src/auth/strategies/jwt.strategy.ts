import { ExtractJwt, Strategy } from 'passport-jwt';
//import {  } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { AuthPayload } from 'src/dto/requests/auth-payload';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    // const user = await this.authClient
    //     .send('get_user', new AuthPayload(payload.sub))
    //     .toPromise()
    //     .catch(err => err);

    // if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: payload.sub,
      //email: payload.email,
    };
  }
}
