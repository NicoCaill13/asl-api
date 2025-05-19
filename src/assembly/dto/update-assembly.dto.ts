import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class UpdateAssemblyDto {
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  date: Date;

  @IsString()
  message: string;
}
