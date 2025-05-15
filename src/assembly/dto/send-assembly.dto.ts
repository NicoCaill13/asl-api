import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SendAssemblyDto {
  // @IsDate()
  // @Type(() => Date)
  // @ApiProperty()
  // Date: Date;

  @IsString()
  html: string;

  @IsArray()
  @ArrayNotEmpty()
  participants: number[];

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Chemin du fichier PDF associé' })
  filePath?: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty()
  email: string;
}
