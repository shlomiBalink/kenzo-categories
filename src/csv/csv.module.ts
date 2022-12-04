import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { CsvService } from './csv.service';

@Module({
  imports: [LoggerModule],
  providers: [CsvService],
  exports: [CsvService],
})
export class CsvModule {}
