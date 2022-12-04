import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [StockModule, LoggerModule],
})
export class AppModule {}
