import { Injectable } from '@nestjs/common';
import * as csvtojson from 'csvtojson';
import { LoggerService } from '../logger/logger.service';

interface ConvertToJsonOptions {
  delimiter: string;
}

const convertToJsonDefaultOptions = { delimiter: ',' };

@Injectable()
export class CsvService {
  private static readonly LOG_CONTEXT = 'CsvService';

  constructor(private loggerService: LoggerService) {
    this.loggerService.setContext(CsvService.LOG_CONTEXT);
  }

  async convertToJson<T extends Record<string, string>>(
    csv: string,
    options: ConvertToJsonOptions = convertToJsonDefaultOptions,
  ): Promise<T[]> {
    const json: T[] = await csvtojson({
      ignoreEmpty: true,
      delimiter: options.delimiter,
    }).fromString(csv);

    this.loggerService.debug('CSV converted to JSON successfully');

    return json;
  }
}
