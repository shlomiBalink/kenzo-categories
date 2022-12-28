import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { MapperService } from './mapper.service';

@Module({
  imports: [LoggerModule],
  providers: [MapperService],
  exports: [MapperService]
})
export class MapperModule {}
