import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCoOwnerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  role: Role;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty()
  emailMain: string;

  @IsEmail()
  @MinLength(2)
  @ApiProperty()
  emailOpt?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  acquisitionDate: Date;

  // @IsOptional()
  // @IsDate()
  // @Type(() => Date)
  // @ApiProperty()
  // saleDate?: Date;
}
