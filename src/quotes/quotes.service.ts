import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Quote, QuoteStatus } from '@prisma/client';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { existsSync, mkdirSync, writeFileSync, readFileSync, createReadStream } from 'fs';
import { join } from 'path';
import { FileUploadService } from '../utils/file-upload.service';

@Injectable()
export class QuotesService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService
  ) {}

  async createQuote(data: CreateQuoteDto, file: Express.Multer.File): Promise<Quote> {
    const filePath = this.fileUploadService.uploadFile(file, 'quotes');

    return this.prisma.quote.create({
      data: {
        ...data,
        filePath,
        status: data.status || 'PENDING',
      },
    });
  }

  async updateQuoteStatus(id: number, status: QuoteStatus): Promise<Quote> {
    return this.prisma.quote.update({
      where: { id },
      data: { status },
    });
  }

  async findAll() {
    return this.prisma.quote.findMany();
  }

  async findOne(id: number) {
    return this.prisma.quote.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.quote.delete({ where: { id } });
  }

  async downloadQuote(filename: string, res: Response): Promise<StreamableFile> {
    const filePath = join(process.cwd(), 'uploads', 'quotes', filename);

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
