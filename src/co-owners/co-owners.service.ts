import { Injectable } from '@nestjs/common';
import { CreateCoOwnerDto } from './dto/create-co-owner.dto';
import { UpdateCoOwnerDto } from './dto/update-co-owner.dto';
import { PrismaService } from '../prisma/prisma.service';

import { ICoOwner } from './entities/co-owner.entity';
import * as bcrypt from 'bcrypt';
export const roundsOfHashing = process.env.ROUNDS_OF_HASHING!;

@Injectable()
export class CoOwnersService {
  constructor(private prisma: PrismaService) {}

  async create(createCoOwnerDto: CreateCoOwnerDto) {
    const hashedPassword = await bcrypt.hash(createCoOwnerDto.password, roundsOfHashing);

    createCoOwnerDto.password = hashedPassword;

    return this.prisma.coOwnership.create({
      data: createCoOwnerDto,
    });
  }

  findAll() {
    return this.prisma.coOwnership.findMany();
  }

  async findOne(id: number) {
    return this.prisma.coOwnership.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(emailMain: string) {
    return this.prisma.coOwnership.findUnique({
      where: { emailMain },
    });
  }

  async update(id: number, updateCoOwnerDto: UpdateCoOwnerDto) {
    if (updateCoOwnerDto.password) {
      updateCoOwnerDto.password = await bcrypt.hash(updateCoOwnerDto.password, roundsOfHashing);
    }

    return this.prisma.coOwnership.update({
      where: { id },
      data: updateCoOwnerDto,
    });
  }

  remove(id: number) {
    return this.prisma.coOwnership.delete({ where: { id } });
  }
}
