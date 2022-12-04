import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StockService } from './stock/stock.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const stockService = app.get(StockService);

  await stockService.import();
}

bootstrap();
