import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CoOwnersModule } from 'src/co-owners/co-owners.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';

export const jwtSecret = process.env.JWT_SECRET!;

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    CoOwnersModule,
  ],
})
export class AuthModule {}
