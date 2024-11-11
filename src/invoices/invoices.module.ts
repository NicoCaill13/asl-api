import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadModule } from '../utils/file-upload.module';

@Module({
  imports: [PrismaModule, FileUploadModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService],
  exports: [InvoicesService], // Exporte si besoin dans d'autres modules
})
export class InvoicesModule {}
