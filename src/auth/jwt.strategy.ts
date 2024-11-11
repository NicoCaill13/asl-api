//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from './auth.module';
import { CoOwnersService } from 'src/co-owners/co-owners.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: CoOwnersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.usersService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
