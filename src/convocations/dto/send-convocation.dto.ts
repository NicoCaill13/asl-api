import { IsEmail, IsString } from 'class-validator';

export class SendConvocationDto {
  @IsEmail()
  email: string;

  @IsString()
  html: string;
}
