import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './logger.types';

@Injectable({
  scope: Scope.TRANSIENT
})
export class LoggerService extends ConsoleLogger {
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    super();

    const logLevels: LogLevel[] = this.configService.get("LOG_LEVELS")?.split(",")
    this.setLogLevels(logLevels)
  }
}
