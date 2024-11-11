import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Contract } from '@prisma/client';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateContractDto): Promise<Contract> {
    try {
      return this.prisma.contract.create({
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log('There is a unique constraint violation, a new user cannot be created with this email');
        }
      }
      throw e.message;
    }
  }

  async findAll(): Promise<Contract[]> {
    return this.prisma.contract.findMany();
  }

  async findOne(id: number): Promise<Contract | null> {
    return this.prisma.contract.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateContractDto): Promise<Contract> {
    return this.prisma.contract.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Contract> {
    return this.prisma.contract.delete({
      where: { id },
    });
  }
}
