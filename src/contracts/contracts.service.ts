import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { Prisma, Contract } from '@prisma/client';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FileUploadService } from '../utils/file-upload.service';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
@Injectable()
export class ContractsService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService
  ) {}
  /**
   * Construit l’URL de téléchargement à partir du chemin interne stocké
   */
  private buildFileUrl(filePath: string | null): string | null {
    if (!filePath) return null;
    const filename = filePath.split('/').pop();

    return filename ? `http://localhost:3000/contracts/download/${encodeURIComponent(filename)}` : null;
  }

  private cleanFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   *
   * @param data
   * @param file
   * @returns
   */
  async create(data: CreateContractDto, file?: Express.Multer.File): Promise<Contract & { fileUrl: string | null }> {
    if (file) {
      file.originalname = this.cleanFileName(file.originalname);
    }
    const filePath = file ? this.fileUploadService.uploadFile(file, 'contracts') : null;

    const contract = await this.prisma.contract.create({
      data: { ...data, filePath },
    });

    return {
      ...contract,
      fileUrl: this.buildFileUrl(contract.filePath),
    };
  }

  async findAll(): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      include: {
        quote: {
          select: {
            id: true,
            title: true,
          },
        },
        invoices: {
          select: { id: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.contract.findUnique({
      where: { id },
      include: {
        quote: {
          select: {
            id: true,
            title: true,
          },
        },
        invoices: {
          select: {
            id: true,
            range: true,
            amount: true,
            status: true,

            filePath: true,
          },
        },
      },
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

  async downloadContract(filename: string, res: Response): Promise<StreamableFile> {
    const filePath = join(process.cwd(), 'uploads', 'contracts', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`Fichier "${filename}" introuvable`);
    }

    // Configure ici les headers
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }
}
