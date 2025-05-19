import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssemblyController } from './assembly.controller';
import { assemblyService } from './assembly.service';
import { PrismaModule } from '../prisma/prisma.module'; // ✅ à importer
import { FileUploadModule } from 'src/utils/file-upload.module';

@Module({
  imports: [ConfigModule, PrismaModule, FileUploadModule], // ✅ ajoute PrismaModule ici
  controllers: [AssemblyController],
  providers: [assemblyService],
})
export class AssemblyModule {}
