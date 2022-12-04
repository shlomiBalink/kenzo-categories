import { TestingModule, Test } from '@nestjs/testing';
import { DATABASE_CONNECTION } from '../src/database/constants';
import { DatabaseConnection } from '../src/database/database.types.d';
import { SFTP_CLIENT } from '../src/sftp/constants';
import { SftpClient } from '../src/sftp/sftp.types.d';
import { StockModule } from '../src/stock/stock.module';
import { StockService } from '../src/stock/stock.service';
import { allStocks, Directory, rootDirectory } from './data/stock';
import { databaseConnectionMock } from './mocks/databaseConnectionMock';
import { sftpClientMock } from './mocks/sftpClientMock';

describe('StockModule', () => {
  let stockService: StockService;
  let sftpClient: SftpClient;
  let databaseConnection: DatabaseConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StockModule],
    })
      .overrideProvider(SFTP_CLIENT)
      .useValue(sftpClientMock)
      .overrideProvider(DATABASE_CONNECTION)
      .useValue(databaseConnectionMock)
      .compile();

    stockService = module.get<StockService>(StockService);
    sftpClient = module.get<SftpClient>(SFTP_CLIENT);
    databaseConnection = module.get<DatabaseConnection>(DATABASE_CONNECTION);
  });

  describe('import', () => {
    it('should import stocks', async () => {
      jest
        .spyOn(sftpClient, 'listFiles')
        .mockImplementation(async (directoryPath: string) => {
          const directories = directoryPath.split('/');

          let currentDirectory: Directory = rootDirectory;
          directories
            .filter((directory) => directory)
            .forEach((directory) => {
              currentDirectory = currentDirectory[directory] as Directory;
            });

          const filePaths = Object.keys(currentDirectory).map(
            (fileName) => `${directoryPath}/${fileName}`,
          );
          return filePaths;
        });
      jest.spyOn(sftpClient, 'isDirectory').mockImplementation(async (path: string) => {
        const directories = path.split('/').filter((directory) => directory);

        let currentDirectory: Directory = rootDirectory;

        for (const directory of directories) {
          const currentFileOrDirectory = currentDirectory[directory];
          if (typeof currentFileOrDirectory === 'string') {
            return false;
          }

          currentDirectory = currentFileOrDirectory;
        }

        return typeof currentDirectory === 'object';
      });
      jest
        .spyOn(sftpClient, 'getFileContent')
        .mockImplementation(async (filePath: string) => {
          const pathParts = filePath.split('/');

          let currentDirectory: Directory = rootDirectory;
          const fileName = pathParts.pop();

          pathParts
            .filter((directory) => directory)
            .forEach((directory) => {
              currentDirectory = currentDirectory[directory] as Directory;
            });

          return currentDirectory[fileName] as string;
        });
      jest.spyOn(databaseConnection, 'hashSet');

      await stockService.import();

      allStocks.forEach(({ store, productId, quantity }) => {
        expect(databaseConnection.hashSet).toHaveBeenCalledWith(
          productId,
          store,
          quantity,
        );
      });
    });
  });
});
