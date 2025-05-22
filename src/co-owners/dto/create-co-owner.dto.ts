import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength, IsEmail, IsNumber, IsDate, IsOptional, IsDateString } from 'class-validator';
import { Role } from '../entities/co-owner.entity';
import { Type } from 'class-transformer';

export class CreateCoOwnerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty()
  emailMain: string;

  @IsOptional()
  @IsEmail()
  @MinLength(2)
  @ApiProperty()
  emailOpt?: string;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty()
  lotNumber: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty()
  bankBalance: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty()
  officeId: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  acquisitionDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  saleDate?: Date;
}
