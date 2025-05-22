import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SendAssemblyDto {
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  date: Date;

  @IsString()
  message: string;

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
  participants: string[];

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
