import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CsvModule } from '../csv/csv.module';
import { SftpModule } from '../sftp/sftp.module';
import { CategoreyService } from './categorey.service';
import { EnvironmentVariables } from './categorey.types';
import { LoggerModule } from '../logger/logger.module';
import { MapperModule } from 'src/mapper/mapper.module';
import { ElasticService } from 'src/elastic/elastic.service';
import { ElasticModule } from 'src/elastic/elastic.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object<EnvironmentVariables>({
        SFTP_CATEGORIES_FOLDER_PATH: Joi.string().required(),
        STOCK_CSV_DELIMITER: Joi.string().default(";"),
      }),
    }),
    SftpModule,
    CsvModule,
    MapperModule,
    ElasticModule
  ],
  providers: [CategoreyService],
})
export class CategoreyModule {}
