import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '../logger/logger.module';
import { SFTP_CLIENT } from './constants';
import { SftpService } from './sftp.service';
import { EnvironmentVariables } from './sftp.types.d';
import { defaultSftpClientFactory } from './sftpClient.default.factory';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object<EnvironmentVariables>({
        SFTP_SERVER: Joi.string().required(),
        SFTP_USER: Joi.string().required(),
        SFTP_PASSWORD: Joi.string().required(),
        SFTP_PORT: Joi.string().required(),
      }),
    }),
  ],
  providers: [
    {
      provide: SFTP_CLIENT,
      useFactory: defaultSftpClientFactory,
      inject: [ConfigService],
    },
    SftpService,
  ],
  exports: [SftpService],
})
export class SftpModule {}
