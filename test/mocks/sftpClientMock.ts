import { SftpClient } from '../../src/sftp/sftp.types.d';

export const sftpClientMock: SftpClient = {
  init: jest.fn(),
  listFiles: jest.fn(),
  getFileContent: jest.fn(),
  isDirectory: jest.fn(),
  closeConnection: jest.fn(),
};
