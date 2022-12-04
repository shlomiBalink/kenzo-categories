import { ConfigService } from '@nestjs/config';
import * as Ssh2SftpClient from 'ssh2-sftp-client';
import { EnvironmentVariables, SftpClient } from './sftp.types.d';

export const defaultSftpClientFactory = (
  configService: ConfigService<EnvironmentVariables>,
): SftpClient => {
  return new DefaultSftpClient(configService);
};

export class DefaultSftpClient implements SftpClient {
  private client: Ssh2SftpClient = null;

  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  async init(): Promise<true> {
    this.client = new Ssh2SftpClient();

    await this.client.connect({
      host: this.configService.get('SFTP_SERVER'),
      username: this.configService.get('SFTP_USER'),
      password: this.configService.get('SFTP_PASSWORD'),
      port: this.configService.get('SFTP_PORT'),
    });

    return true;
  }

  async listFiles(directoryPath: string): Promise<string[]> {
    if (!this.client) {
      await this.init();
    }

    const filesInfo = await this.client.list(directoryPath);
    const filePaths = filesInfo.map((info) => `${directoryPath}/${info.name}`);
    return filePaths;
  }

  async getFileContent(filePath: string): Promise<string> {
    if (!this.client) {
      await this.init();
    }

    const fileContent = await this.client.get(filePath);
    return fileContent.toString();
  }

  async isDirectory(path: string): Promise<boolean> {
    if (!this.client) {
      await this.init();
    }

    const fileStats = await this.client.stat(path);
    const isDirectory = fileStats.isDirectory;
    return isDirectory;
  }

  async closeConnection(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }
}
