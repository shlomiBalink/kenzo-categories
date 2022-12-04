import { Test, TestingModule } from '@nestjs/testing';
import { loggerServiceMock } from '../../test/mocks/loggerServiceMock';
import { sftpClientMock } from '../../test/mocks/sftpClientMock';
import { LoggerService } from '../logger/logger.service';
import { SFTP_CLIENT } from './constants';
import { SftpService } from './sftp.service';
import { SftpClient } from './sftp.types.d';

describe('SftpService', () => {
  let service: SftpService;
  let sftpClient: SftpClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: LoggerService, useValue: loggerServiceMock },
        {
          provide: SFTP_CLIENT,
          useValue: sftpClientMock,
        },
        SftpService,
      ],
    }).compile();

    service = module.get<SftpService>(SftpService);
    sftpClient = module.get<SftpClient>(SFTP_CLIENT);
  });

  describe('init', () => {
    it('should call the instance init method', async () => {
      await service.init();

      expect(sftpClient.init).toHaveBeenCalledWith();
    });
  });

  describe('listFiles', () => {
    const rootDirectoryPath = '';
    const rootDirectoryTree = {
      file1: true,
      file2: true,
      directory1: {
        directory1_file1: true,
      },
      directory2: {
        directory2_file1: true,
        directory2_file2: true,
        directory2_file3: true,
        directory3: {
          directory3_file1: true,
        },
      },
    };

    beforeEach(() => {
      jest
        .spyOn(sftpClient, 'listFiles')
        .mockImplementation(async (directoryPath: string) => {
          const directories = directoryPath.split('/');

          let currentDirectory = rootDirectoryTree;

          directories.forEach((directory) => {
            if (directory) {
              currentDirectory = currentDirectory[directory];
            }
          });

          const filePaths = Object.keys(currentDirectory).map(
            (fileName) => `${directoryPath}/${fileName}`,
          );
          return filePaths;
        });
      jest.spyOn(sftpClient, 'isDirectory').mockImplementation(async (path: string) => {
        const directories = path.split('/');

        let currentDirectory = rootDirectoryTree;
        // /directory1/directory2/file1
        for (const directory of directories) {
          if (directory) {
            if (typeof currentDirectory[directory] !== 'object') {
              return false;
            }
            currentDirectory = currentDirectory[directory];
          }
        }

        return typeof currentDirectory === 'object';
      });
    });

    it('should call the instance listFiles method', async () => {
      await service.listFiles(rootDirectoryPath, { recursive: true });

      expect(sftpClient.listFiles).toHaveBeenCalledWith(rootDirectoryPath);
    });

    it('should list all files at directory', async () => {
      const files = await service.listFiles(rootDirectoryPath);

      const expected = ['/file1', '/file2', '/directory1', '/directory2'];
      expect(files).toEqual(expected);
    });

    it('should list all files at directory without returning directories', async () => {
      const files = await service.listFiles(rootDirectoryPath, {
        returnDirectoryPaths: false,
      });

      const expected = ['/file1', '/file2'];
      expect(files).toEqual(expected);
    });

    it('should list files recursively', async () => {
      const files = await service.listFiles(rootDirectoryPath, { recursive: true });

      const expected = [
        '/file1',
        '/file2',
        '/directory1',
        '/directory1/directory1_file1',
        '/directory2',
        '/directory2/directory2_file1',
        '/directory2/directory2_file2',
        '/directory2/directory2_file3',
        '/directory2/directory3',
        '/directory2/directory3/directory3_file1',
      ];
      expect(files).toEqual(expected);
    });

    it('should list files recursively without returning directories', async () => {
      const files = await service.listFiles(rootDirectoryPath, {
        recursive: true,
        returnDirectoryPaths: false,
      });

      const expected = [
        '/file1',
        '/file2',
        '/directory1/directory1_file1',
        '/directory2/directory2_file1',
        '/directory2/directory2_file2',
        '/directory2/directory2_file3',
        '/directory2/directory3/directory3_file1',
      ];
      expect(files).toEqual(expected);
    });
  });

  describe('getFileContent', () => {
    it('should call the instance getFileContent method', async () => {
      const filePath = 'filePath';

      await service.getFileContent(filePath);

      expect(sftpClient.getFileContent).toHaveBeenCalledWith(filePath);
    });
  });

  describe('isDirectory', () => {
    it('should call the instance isDirectory method', async () => {
      const path = 'path';

      await service.isDirectory(path);

      expect(sftpClient.isDirectory).toHaveBeenCalledWith(path);
    });
  });

  describe('closeConnection', () => {
    it('should call the instance closeConnection method', async () => {
      await service.closeConnection();

      expect(sftpClient.closeConnection).toHaveBeenCalledWith();
    });
  });
});
