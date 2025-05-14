import { IsOptional, IsString, IsInt, IsNumber, IsDate, IsEnum } from 'class-validator';
import { Frequency } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateContractDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  utility?: string;

  @IsOptional()
  @IsEnum(Frequency)
  frequency?: Frequency;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;
}
