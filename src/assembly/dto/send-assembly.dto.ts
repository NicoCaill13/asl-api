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

  @Transform(({ value }) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed;
    } catch {
      return [];
    }
  })
  @IsArray({ message: 'participants must be an array' })
  @ArrayNotEmpty({ message: 'participants should not be empty' })
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
