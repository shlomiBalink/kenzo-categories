import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CsvModule } from '../csv/csv.module';
import { SftpModule } from '../sftp/sftp.module';
import { StockService } from './stock.service';
import { EnvironmentVariables } from './stock.types.d';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object<EnvironmentVariables>({
        SFTP_STOCKS_FOLDER_PATH: Joi.string().required(),
        STOCK_CSV_DELIMITER: Joi.string().default(";"),
      }),
    }),
    SftpModule,
    CsvModule,
  ],
  providers: [StockService],
})
export class StockModule {}
