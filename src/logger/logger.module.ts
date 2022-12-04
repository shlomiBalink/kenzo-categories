import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { EnvironmentVariables } from './logger.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object<EnvironmentVariables>({
        LOG_LEVELS: Joi.string().required(),
      }),
    })
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
