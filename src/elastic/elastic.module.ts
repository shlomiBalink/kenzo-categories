import { HttpConnection } from '@elastic/elasticsearch';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { LoggerModule } from 'src/logger/logger.module';
import { ElasticService } from './elastic.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: `${process.env.ELASTIC_HOST}:${process.env.ELASTIC_PORT}`,
      Connection: HttpConnection,
      auth:{
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    }),
    LoggerModule
  ],
  providers: [ElasticService],
  exports: [ElasticService]
})
export class ElasticModule {}
