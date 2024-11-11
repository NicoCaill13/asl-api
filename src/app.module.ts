import { HttpStatus, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OfficesModule } from './offices/offices.module';
import { CoOwnersModule } from './co-owners/co-owners.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesService } from './invoices/invoices.service';
import { InvoicesModule } from './invoices/invoices.module';
import { ContractsController } from './contracts/contracts.controller';
import { ContractsService } from './contracts/contracts.service';
import { ContractsModule } from './contracts/contracts.module';
import { QuotesController } from './quotes/quotes.controller';
import { QuotesService } from './quotes/quotes.service';
import { QuotesModule } from './quotes/quotes.module';
import { FileUploadModule } from './utils/file-upload.module';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule,
    OfficesModule,
    CoOwnersModule,
    AuthModule,
    ConfigModule.forRoot(),
    InvoicesModule,
    ContractsModule,
    QuotesModule,
    FileUploadModule,
  ],
  controllers: [AppController, InvoicesController, ContractsController, QuotesController],
  providers: [
    AppService,
    InvoicesService,
    ContractsService,
    QuotesService,
    providePrismaClientExceptionFilter({
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  ],
})
export class AppModule {}
