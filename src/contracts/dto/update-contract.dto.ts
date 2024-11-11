import { IsOptional, IsString, IsInt } from 'class-validator';
import { Frequency } from '@prisma/client';

export class UpdateContractDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  utility?: string;

  @IsOptional()
  @IsInt()
  frequency?: Frequency;
}
