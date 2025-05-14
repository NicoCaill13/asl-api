import { Module } from '@nestjs/common';
import { ConvocationsController } from './convocations.controller';
import { ConvocationsService } from './convocations.service';

@Module({
  controllers: [ConvocationsController],
  providers: [ConvocationsService],
})
export class ConvocationsModule {}
