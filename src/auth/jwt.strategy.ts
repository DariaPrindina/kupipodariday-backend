import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtsecret',
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = this.usersService.findOneById(jwtPayload.sub);
    if (!user) {
      throw new UnauthorizedException('Ошибка авторизации');
    }
    return user;
  }
}
