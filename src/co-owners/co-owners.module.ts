import { Module } from "@nestjs/common";
import { CoOwnersService } from "./co-owners.service";
import { CoOwnersController } from "./co-owners.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    controllers: [CoOwnersController],
    providers: [CoOwnersService],
    imports: [PrismaModule],
    exports: [CoOwnersService],
})
export class CoOwnersModule {}
