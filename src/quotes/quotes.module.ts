import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadModule } from '../utils/file-upload.module';
@Module({
  imports: [PrismaModule, FileUploadModule],
  controllers: [QuotesController],
  providers: [QuotesService, PrismaService],
  exports: [QuotesService],
})
@Module({})
export class QuotesModule {}
