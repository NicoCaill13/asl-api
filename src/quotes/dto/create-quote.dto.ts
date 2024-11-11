import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { QuoteStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsEnum(QuoteStatus)
  @ApiProperty({ enum: [QuoteStatus] })
  status?: QuoteStatus;
}
