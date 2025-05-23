import { IsNotEmpty, IsString, IsInt, IsOptional, IsNumber, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Frequency, Utility } from '@prisma/client';

export class CreateContractDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty({ enum: Utility })
  @IsEnum(Utility)
  utility: Utility;

  @IsOptional()
  @IsEnum(Frequency)
  @ApiProperty({ enum: [Frequency] })
  frequency: Frequency;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  quoteId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Chemin du fichier PDF associé' })
  filePath?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  paymentDate?: Date;
}
