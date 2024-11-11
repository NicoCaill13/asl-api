import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, MinLength, IsEmail, IsDecimal } from "class-validator";

export class CreateOfficeDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty()
    name: string;

    @IsInt()
    @ApiProperty()
    totalLot: number;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    bankAccountNumber: string;

    @IsDecimal()
    @IsNotEmpty()
    @ApiProperty()
    bankBalance: number;
}
