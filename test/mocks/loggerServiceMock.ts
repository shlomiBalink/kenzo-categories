import { LoggerService } from "../../src/logger/logger.service";

export const loggerServiceMock: Partial<LoggerService> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  setContext: jest.fn()
};
