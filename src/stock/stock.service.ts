import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { CsvService } from '../csv/csv.service';
import { SftpService } from '../sftp/sftp.service';
import { CsvStock, EnvironmentVariables, Stock } from './stock.types.d';

@Injectable()
export class StockService {
  private static readonly LOG_CONTEXT = 'StockService';

  constructor(
    private loggerService: LoggerService,
    private configService: ConfigService<EnvironmentVariables>,
    private sftpService: SftpService,
    private csvService: CsvService,
  ) {
    this.loggerService.setContext(StockService.LOG_CONTEXT);
  }

  async import() {
  }
}
