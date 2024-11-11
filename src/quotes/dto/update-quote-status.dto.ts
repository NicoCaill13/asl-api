import { IsNotEmpty, IsEnum } from 'class-validator';
import { QuoteStatus } from '@prisma/client';

export class UpdateQuoteStatusDto {
  @IsNotEmpty()
  @IsEnum(QuoteStatus)
  status: QuoteStatus;
}
