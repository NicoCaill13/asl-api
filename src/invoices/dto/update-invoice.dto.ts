import { IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { InvoiceStatut } from '@prisma/client';

export class UpdateInvoicesStatusDto {
  @IsNotEmpty()
  @IsEnum(InvoiceStatut)
  status: InvoiceStatut;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
