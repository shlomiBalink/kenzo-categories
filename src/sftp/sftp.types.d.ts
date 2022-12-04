export interface EnvironmentVariables {
  SFTP_SERVER: string;
  SFTP_USER: string;
  SFTP_PASSWORD: string;
  SFTP_PORT: string;
}

export interface SftpListFileOptions {
  recursive?: true;
  returnDirectoryPaths?: false;
}

export interface SftpClient {
  init(): Promise<true>;
  listFiles(directoryPath: string): Promise<string[]>;
  getFileContent(filePath: string): Promise<string>;
  isDirectory(path: string): Promise<boolean>;
  closeConnection(): Promise<void>;
}
