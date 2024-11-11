import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { CoOwnersService } from 'src/co-owners/co-owners.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: CoOwnersService
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const { id, role, name, address, emailMain, emailOpt, lotNumber, bankBalance, city, zipCode, phone, officeId } = user;
    return {
      accessToken: this.jwtService.sign({
        id,
        role,
        name,
        address,
        emailMain,
        emailOpt,
        lotNumber,
        bankBalance,
        city,
        zipCode,
        phone,
        officeId,
      }),
    };
  }
}
