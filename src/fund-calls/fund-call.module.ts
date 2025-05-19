import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadModule } from '../utils/file-upload.module';
import { FundCallController } from './fund-call.controller';
import { FundCallService } from './fund-call.service';
@Module({
  imports: [PrismaModule, FileUploadModule],
  controllers: [FundCallController],
  providers: [FundCallService, PrismaService],
  exports: [FundCallService],
})
@Module({})
export class QuotesModule {}
