import { Test, TestingModule } from '@nestjs/testing';
import { loggerServiceMock } from '../../test/mocks/loggerServiceMock';
import { LoggerService } from '../logger/logger.service';
import { CsvService } from './csv.service';

describe('CsvService', () => {
  let service: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: LoggerService, useValue: loggerServiceMock }, CsvService],
    }).compile();

    service = module.get<CsvService>(CsvService);
  });

  describe('convertCsvToJson', () => {
    it('should convert CSV to JSON', async () => {
      const csvLines = ['a,b,c', 'test1,2,3', 'test4,5,6'];
      const csv = csvLines.join('\n');

      const result = await service.convertToJson(csv);

      const expected = [
        { a: 'test1', b: '2', c: '3' },
        { a: 'test4', b: '5', c: '6' },
      ];
      expect(result).toEqual(expected);
    });

    it('should not convert string to number', async () => {
      const csvLines = ['a,b,c', '1,1.5,'];
      const csv = csvLines.join('\n');

      const result = await service.convertToJson(csv);

      const expected = [{ a: '1', b: '1.5' }];
      expect(result).toEqual(expected);
    });

    it('should not set value for empty column', async () => {
      const csvLines = ['a,b,c', '1,,'];
      const csv = csvLines.join('\n');

      const result = await service.convertToJson(csv);

      const expected = [{ a: '1' }];
      expect(result).toEqual(expected);
    });

    it('should convert CSV to JSON with specified delimiter', async () => {
      const csvLines = ['a;b;c', 'test1;2;3', 'test4;5;6'];
      const csv = csvLines.join('\n');

      const result = await service.convertToJson(csv, { delimiter: ';' });

      const expected = [
        { a: 'test1', b: '2', c: '3' },
        { a: 'test4', b: '5', c: '6' },
      ];
      expect(result).toEqual(expected);
    });
  });
});
