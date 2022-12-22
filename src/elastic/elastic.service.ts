import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Categorey } from 'src/mapper/mapper.types';

@Injectable()
export class ElasticService {

    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async pushToElastic(indexName: string, categories: Categorey[]) {

        const indexExits = await this.elasticsearchService.indices.exists({ index: indexName })

        if(!indexExits){
            this.createIndex(indexName);
        }
        

        const operations = categories.flatMap(doc => [{ index: { _index: indexName } }, doc])

        const bulkResponse = await this.elasticsearchService.bulk({ refresh: true, operations })

    }

    private createIndex(indexName: string) {
        this.elasticsearchService.indices.create({
            index: indexName
        })
    }
}
