import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { ConfigService } from '@nestjs/config';
import { testEnvironmentVariables } from '../../test/data/environmentVariables';
import { EnvironmentVariables } from './logger.types';
import { LogLevel } from '@nestjs/common';

describe('LoggerService', () => {
  let service: LoggerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, LoggerService],
    }).compile();

    configService = module.get(ConfigService);
    service = await module.resolve<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should use environment variable for log levels', () => {
    const logLevels: LogLevel[] = (
      testEnvironmentVariables as EnvironmentVariables
    ).LOG_LEVELS.split(',') as LogLevel[];

    logLevels.forEach((logLevel) => {
      expect(service.isLevelEnabled(logLevel)).toEqual(true);
    });
  });
});
