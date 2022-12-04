import { when } from 'jest-when';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CsvService } from '../csv/csv.service';
import { DATABASE_CONNECTION } from '../database/constants';
import { DatabaseService } from '../database/database.service';
import { SFTP_CLIENT } from '../sftp/constants';
import { SftpService } from '../sftp/sftp.service';
import { StockService } from './stock.service';
import {
  CsvStock,
  EnvironmentVariables as StockEnvironmentVariables,
  Stock,
} from './stock.types.d';
import { SftpListFileOptions } from 'src/sftp/sftp.types.d';
import { sftpClientMock } from '../../test/mocks/sftpClientMock';
import { databaseConnectionMock } from '../../test/mocks/databaseConnectionMock';
import { testEnvironmentVariables } from '../../test/data/environmentVariables';
import { LoggerService } from '../../src/logger/logger.service';
import { loggerServiceMock } from '../../test/mocks/loggerServiceMock';

describe('StockService', () => {
  let service: StockService;
  let configService: ConfigService;
  let sftpService: SftpService;
  let databaseService: DatabaseService;
  let csvService: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: LoggerService, useValue: loggerServiceMock },
        ConfigService,
        SftpService,
        DatabaseService,
        CsvService,
        StockService,
        {
          provide: SFTP_CLIENT,
          useValue: sftpClientMock,
        },
        {
          provide: DATABASE_CONNECTION,
          useValue: databaseConnectionMock,
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    configService = module.get<ConfigService>(ConfigService);
    sftpService = module.get<SftpService>(SftpService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    csvService = module.get<CsvService>(CsvService);
  });

  describe('convertCsvStock', () => {
    it('should convert CsvStock to Stock', () => {
      const csvStock: CsvStock = {
        store: 'store',
        product_id: 'product_id',
        quantity: 'quantity',
        quantity_in_transit: 'quantity_in_transit',
        quantity_defective: 'quantity_defective',
        quantity_reserved: 'quantity_reserved',
        quantity_to_return: 'quantity_to_return',
      };

      const result = service['convertCsvStock'](csvStock);

      const expected: Stock = {
        store: 'store',
        productId: 'product_id',
        quantity: 'quantity',
      };
      expect(result).toEqual(expected);
    });
  });

  describe('import', () => {
    it('should pass variables correctly between services', async () => {
      const rootDirectoryPath = '/';
      const filePath = '/file';
      const stock: Stock = {
        productId: '123456',
        store: '123456789',
        quantity: '1',
      };
      const stockFromCsv: CsvStock = {
        product_id: stock.productId,
        store: stock.store,
        quantity: stock.quantity,
        quantity_in_transit: '',
        quantity_defective: '',
        quantity_reserved: '',
        quantity_to_return: '',
      };
      const stockCsv = [
        'store;product_id;quantity;quantity_in_transit;quantity_defective;quantity_reserved;quantity_to_return',
        `${stockFromCsv.store};${stockFromCsv.product_id};${stockFromCsv.quantity};;;;`,
      ].join('\n');

      const listFilesOptions: SftpListFileOptions = {
        recursive: true,
        returnDirectoryPaths: false,
      };
      jest.spyOn(configService, 'get');
      when(jest.spyOn(sftpService, 'listFiles'))
        .calledWith(rootDirectoryPath, listFilesOptions)
        .mockResolvedValue([filePath]);
      when(jest.spyOn(sftpService, 'getFileContent'))
        .calledWith(filePath)
        .mockResolvedValue(stockCsv);
      when(jest.spyOn(csvService, 'convertToJson'))
        .calledWith(stockCsv)
        .mockResolvedValue([stockFromCsv]);
      when(jest.spyOn(service as any, 'convertCsvStock'))
        .calledWith(stockFromCsv)
        .mockResolvedValue(stock);
      when(jest.spyOn(databaseService, 'hashSet'))
        .calledWith(stock.store, stock.productId, stock.quantity)
        .mockResolvedValue();

      await service.import();

      expect(configService.get).toHaveBeenCalledWith(
        'SFTP_STOCKS_FOLDER_PATH' as keyof StockEnvironmentVariables,
      );
      expect(configService.get).toHaveBeenCalledWith(
        'STOCK_CSV_DELIMITER' as keyof StockEnvironmentVariables,
      );
      expect(sftpService.listFiles).toHaveBeenCalledWith(
        rootDirectoryPath,
        listFilesOptions,
      );
      expect(sftpService.getFileContent).toHaveBeenCalledWith(filePath);
      expect(csvService.convertToJson).toHaveBeenCalledWith(stockCsv, {
        delimiter: (testEnvironmentVariables as StockEnvironmentVariables)
          .STOCK_CSV_DELIMITER,
      });
      expect(databaseService.hashSet).toHaveBeenCalledWith(
        stock.productId,
        stock.store,
        stock.quantity,
      );
    });
  });
});
