import { EnvironmentVariables as DatabaseEnvironmentVariables } from 'src/database/database.types.d';
import { EnvironmentVariables as StockEnvironmentVariables } from 'src/stock/stock.types.d';
import { EnvironmentVariables as SftpEnvironmentVariables } from 'src/sftp/sftp.types.d';
import { EnvironmentVariables as LoggerEnvironmentVariables } from 'src/logger/logger.types.d';

type EnvironmentVariables =
  | DatabaseEnvironmentVariables
  | StockEnvironmentVariables
  | SftpEnvironmentVariables
  | LoggerEnvironmentVariables;

export const testEnvironmentVariables: EnvironmentVariables = {
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PASSWORD: 'REDIS_PASSWORD',
  REDIS_USERNAME: 'REDIS_USERNAME',
  SFTP_SERVER: 'SFTP_SERVER',
  SFTP_USER: 'SFTP_USER',
  SFTP_PASSWORD: 'SFTP_PASSWORD',
  SFTP_PORT: 'SFTP_PORT',
  SFTP_STOCKS_FOLDER_PATH: '/',
  STOCK_CSV_DELIMITER: ';',
  LOG_LEVELS: 'LOG_LEVELS'
} as any;

Object.entries(testEnvironmentVariables).forEach(([key, value]) => {
  process.env[key] = value;
});
