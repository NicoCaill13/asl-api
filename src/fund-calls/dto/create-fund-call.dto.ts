import { ApiProperty } from '@nestjs/swagger';
import { FundCallStatut } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class SendFundCallDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  message: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  reference: string;

  @IsNumber()
  @Min(1)
  installment: number;

  @IsNumber()
  @IsOptional()
  amountPaid?: number;

  @IsOptional()
  @ApiProperty()
  @IsEnum(FundCallStatut)
  status?: FundCallStatut;

  @ApiProperty({ type: [String], description: 'Liste d’emails des participants' })
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  })
  @IsArray()
  @IsEmail({}, { each: true })
  coOwners: string[];
}
