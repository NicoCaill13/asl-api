import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateAssemblyDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Chemin du fichier PDF associé' })
  filePath?: string;
}
