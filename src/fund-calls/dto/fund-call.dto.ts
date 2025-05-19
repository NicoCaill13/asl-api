import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class SendFundCallDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsNumber()
  total: number;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  participants: string[];
}
