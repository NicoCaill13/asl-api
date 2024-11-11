import { Module } from "@nestjs/common";
import { OfficesService } from "./offices.service";
import { OfficesController } from "./offices.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    controllers: [OfficesController],
    providers: [OfficesService],
    imports: [PrismaModule],
})
export class OfficesModule {}
