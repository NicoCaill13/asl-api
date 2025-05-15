import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssemblyController } from './assembly.controller';
import { AssemblyService } from './assembly.service';

@Module({
  imports: [ConfigModule],
  controllers: [AssemblyController],
  providers: [AssemblyService],
})
export class AssemblyModule {}
