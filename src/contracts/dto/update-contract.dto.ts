import { IsOptional, IsString, IsInt, IsNumber, IsDate, IsEnum } from 'class-validator';
import { Frequency, Utility } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ApiProperty({ enum: Utility })
  @IsEnum(Utility)
  utility: Utility;

  @IsOptional()
  @IsEnum(Frequency)
  frequency?: Frequency;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;
}
