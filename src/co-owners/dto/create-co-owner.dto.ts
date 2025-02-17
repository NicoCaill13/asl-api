import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength, IsEmail, IsNumber, IsDate, IsOptional } from 'class-validator';
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

  @IsEmail()
  @MinLength(2)
  @ApiProperty()
  emailOpt: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  lotNumber: number;

  @IsNumber()
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
