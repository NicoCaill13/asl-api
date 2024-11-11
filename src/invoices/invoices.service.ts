import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Invoice } from '@prisma/client';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FileUploadService } from '../utils/file-upload.service';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService
  ) {}

  async createInvoice(data: CreateInvoiceDto, file: Express.Multer.File): Promise<Invoice> {
    const filePath = this.fileUploadService.uploadFile(file, 'invoices');
    return this.prisma.invoice.create({
      data: {
        ...data,
        filePath,
      },
    });
  }

  async getInvoice(id: number): Promise<Invoice> {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    return invoice;
  }

  async downloadInvoiceFile(id: number): Promise<Buffer> {
    const invoice = await this.getInvoice(id);
    if (!invoice.filePath) throw new NotFoundException('File not found for this invoice');

    return readFileSync(invoice.filePath);
  }
}
