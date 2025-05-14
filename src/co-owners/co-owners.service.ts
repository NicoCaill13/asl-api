import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    if (isNaN(rounds) || rounds < 4) {
      throw new Error('Rounds de hashage invalides.');
    }

    const hashedPassword = await bcrypt.hash(createCoOwnerDto.password, rounds);

    return this.prisma.coOwnership.create({
      data: {
        ...createCoOwnerDto,
        password: hashedPassword,
        acquisitionDate: new Date(createCoOwnerDto.acquisitionDate),
        saleDate: createCoOwnerDto.saleDate ? new Date(createCoOwnerDto.saleDate) : null,
      },
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

  async findAllMainEmails() {
    return this.prisma.coOwnership.findMany({
      select: {
        id: true,
        emailMain: true,
        lotNumber: true,
      },
      where: {
        emailMain: { not: undefined },
      },
    });
  }

  async update(id: number, dto: UpdateCoOwnerDto) {
    const coOwner = await this.prisma.coOwnership.findUnique({ where: { id } });

    if (!coOwner) {
      throw new NotFoundException(`Co-owner avec l'ID ${id} introuvable.`);
    }

    try {
      const rounds = parseInt(process.env.HASH_ROUNDS || '10', 10);

      if (dto.password) {
        dto.password = await bcrypt.hash(dto.password, rounds);
      }

      return await this.prisma.coOwnership.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      console.error(' Erreur updateCoOwner:', error);
      throw new InternalServerErrorException('Erreur lors de la mise à jour du propriétaire.');
    }
  }

  remove(id: number) {
    return this.prisma.coOwnership.delete({ where: { id } });
  }
}
