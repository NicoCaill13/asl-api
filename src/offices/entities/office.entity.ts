import { Office } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class OfficeEntity implements Office {
    constructor(partial: Partial<OfficeEntity>) {
        Object.assign(this, partial);
    }
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    totalLot: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    bankAccountNumber: string;

    @ApiProperty()
    bankBalance: number;
}
