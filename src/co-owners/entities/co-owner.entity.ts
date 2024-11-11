export class CoOwner {}

import { CoOwnership } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { OfficeEntity } from "src/offices/entities/office.entity";

export enum Role {
    OWNER = "OWNER",
    PRESIDENT = "PRESIDENT",
    VICE_PRESIDENT = "VICE_PRESIDENT",
    SECRETARY = "SECRETARY",
    TREASURER = "TREASURER",
}

export interface ICoOwner {
    name: string;
    role: Role;
    address: string;
    emailMain: string;
    emailOpt: string;
    lotNumber: number;
    bankBalance: number;
    city: string;
    zipCode: string;
    phone: string;
    officeId: number;
    password: string;
}

export class CoOwnerEntity implements CoOwnership {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    role: Role;

    @ApiProperty()
    address: string;

    @ApiProperty()
    emailMain: string;

    @ApiProperty()
    emailOpt: string;

    @ApiProperty()
    lotNumber: number;

    @ApiProperty()
    bankBalance: number;

    @ApiProperty()
    city: string;

    @ApiProperty()
    zipCode: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    officeId: number;

    @ApiProperty()
    password: string;

    @ApiProperty({ required: false, type: OfficeEntity })
    Office?: OfficeEntity;
    constructor({ Office, ...data }: Partial<CoOwnerEntity>) {
        Object.assign(this, data);
        if (Office) {
            this.Office = new OfficeEntity(Office);
        }
    }
}
