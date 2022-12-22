import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CategoreyService } from './categoreys/categorey.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const categoreyService = app.get(CategoreyService);

  await categoreyService.import();
}

bootstrap();
