import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Invoice } from '@prisma/client';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FileUploadService } from '../utils/file-upload.service';
import { calculateProrataAmount } from '../utils/prorata';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService
  ) { }

  async createInvoice(data: CreateInvoiceDto, file: Express.Multer.File): Promise<Invoice> {
    const filePath = this.fileUploadService.uploadFile(file, 'invoices');
    return this.prisma.invoice.create({
      data: {
        ...data,
        filePath,
      },
    });
  }

  async getInvoice(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        contract: {},
        Office: {
          include: { CoOwnership: true },
        }
      }
    });
    if (!invoice) throw new NotFoundException('Invoice not found');




    const invoiceYear = invoice.year ? invoice.year : invoice.range.getFullYear();
    const totalAmount = invoice.amount;
    const coOwners = invoice.Office.CoOwnership // Liste des copropriétaires

    if (coOwners.length === 0) {
      throw new Error(`Aucun copropriétaire trouvé pour cette ASL.`);
    }

    // Calcul du prorata pour chaque copropriétaire
    const prorataAmounts = coOwners.map(coOwner => ({
      ...coOwner,
      prorataAmount: invoice.contract.frequency === 'YEARLY' ? calculateProrataAmount(
        coOwner.acquisitionDate,
        coOwner.saleDate,
        invoiceYear,
        totalAmount,
        coOwners.length // Répartition sur tous les copropriétaires actifs cette année
      ) : invoice.amount / coOwners.length
    }));

    return {
      id: invoice.id,
      range: invoice.range,
      dueDate: invoice.dueDate,
      year: invoice.year,
      amount: invoice.amount,
      status: invoice.status,
      name: invoice.contract.name,
      utility: invoice.contract.utility,
      frequency: invoice.contract.frequency,

      coOwners: prorataAmounts, // Injecter les copropriétaires avec le prorata calculé
    };


  }

  async getInvoices(): Promise<Invoice[]> {
    return this.prisma.invoice.findMany();
  }

  // async downloadInvoiceFile(id: number): Promise<Buffer> {
  //   const invoice = await this.getInvoice(id);
  //   if (!invoice.filePath) throw new NotFoundException('File not found for this invoice');

  //   return readFileSync(invoice.filePath);
  // }
}
