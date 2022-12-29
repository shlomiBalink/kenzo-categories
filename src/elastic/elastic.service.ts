import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { LoggerService } from 'src/logger/logger.service';
import { Categorey } from 'src/mapper/mapper.types';

@Injectable()
export class ElasticService {

    private static readonly LOG_CONTEXT = "ElasticService";

    constructor(private readonly elasticsearchService: ElasticsearchService, private loggerService: LoggerService) { }

    async pushToElastic(indexName: string, categories: Categorey[]) {

        const indexExits = await this.elasticsearchService.indices.exists({ index: indexName })

        if(indexExits){
            await this.elasticsearchService.indices.delete({index: indexName});
            this.loggerService.debug(`previous ${indexName} index deleted`);
        }
        
        await this.elasticsearchService.indices.create({index: indexName})
        this.loggerService.debug('new index created')

        const operations = categories.flatMap(doc => [{ index: { _index: indexName } }, doc])

        await this.elasticsearchService.bulk({ refresh: false, operations })

    }

    private createIndex(indexName: string) {
        this.elasticsearchService.indices.create({ 
            index: indexName
        })
    }
}
