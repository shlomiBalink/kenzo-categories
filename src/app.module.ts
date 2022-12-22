import { Module } from '@nestjs/common';
import { CategoreyModule } from './categoreys/categorey.module';
import { LoggerModule } from './logger/logger.module';
import { MapperModule } from './mapper/mapper.module';
import { ElasticModule } from './elastic/elastic.module';

@Module({
  imports: [CategoreyModule, LoggerModule, MapperModule, ElasticModule],
})
export class AppModule {}
