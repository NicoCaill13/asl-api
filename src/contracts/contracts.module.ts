import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FileUploadModule } from '../utils/file-upload.module';

@Module({
  imports: [PrismaModule, FileUploadModule],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService], // Exporte si besoin dans d'autres modules
})
export class ContractsModule {}
