import { IsNotEmpty, IsString, IsInt, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Frequency } from '@prisma/client';

export class CreateContractDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  utility: string;

  @IsOptional()
  @IsEnum(Frequency)
  @ApiProperty({ enum: [Frequency] })
  frequency: Frequency;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsInt()
  quoteId?: number;
}
