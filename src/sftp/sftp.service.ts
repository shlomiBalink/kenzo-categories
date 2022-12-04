import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { SFTP_CLIENT } from './constants';
import { SftpClient, SftpListFileOptions } from './sftp.types.d';

@Injectable()
export class SftpService {
  private static readonly LOG_CONTEXT = 'SftpService';

  constructor(
    private loggerService: LoggerService,
    @Inject(SFTP_CLIENT) private sftpClient: SftpClient,
  ) {
    this.loggerService.setContext(SftpService.LOG_CONTEXT)
  }
  
  async init(): Promise<true> {
    await this.sftpClient.init();
    this.loggerService.debug('Connection initiated successfully');
    return true;
  }
  async listFiles(
    directoryPath: string,
    options: SftpListFileOptions = {},
  ): Promise<string[]> {
    const filePaths = await this.sftpClient.listFiles(directoryPath);

    const filePathsToReturn = [];

    for (const filePath of filePaths) {
      if (!(await this.isDirectory(filePath))) {
        filePathsToReturn.push(filePath);
      } else {
        if (options.returnDirectoryPaths !== false) {
          filePathsToReturn.push(filePath);
        }
        if (options.recursive) {
          const recursiveDirectoryFiles = await this.listFiles(filePath, options);
          filePathsToReturn.push(...recursiveDirectoryFiles);
        }
      }
    }

    this.loggerService.debug('Files listed successfully');

    return filePathsToReturn;
  }
  async getFileContent(filePath: string): Promise<string> {
    return await this.sftpClient.getFileContent(filePath);
  }
  async isDirectory(path: string): Promise<boolean> {
    return await this.sftpClient.isDirectory(path);
  }
  async closeConnection(): Promise<void> {
    await this.sftpClient.closeConnection();
    this.loggerService.debug('Connection closed successfully');
  }
}
