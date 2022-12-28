import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { Categorey } from './mapper.types';

@Injectable()
export class MapperService {
    private static readonly LOG_CONTEXT = 'MapperService';

    constructor(private loggerService: LoggerService){
        this.loggerService.setContext(MapperService.LOG_CONTEXT);
    }

    languages = ['en', 'es', 'fr', 'ja', 'zh'];

    allCategoreyMap = new Map<string, Categorey[]>();
    elasticCategories = new Map<string, Categorey[]>();

    map(rawCategories: any): Map<string, Categorey[]> {

        this.loggerService.debug('mapping starting');

        rawCategories.forEach((categorey) => {
            categorey.names.forEach((name, i) => {
                this.createCategoreyIfNeeded(name.lang);
                this.allCategoreyMap.get(name.lang).push(new Categorey(categorey.store_region, categorey.id, name.value, i));
            });

            categorey.childs.forEach((child, j) => {
                child.names.forEach(chName => {
                    this.createCategoreyIfNeeded(chName.lang);
                    this.allCategoreyMap.get(chName.lang).push(new Categorey(categorey.store_region, child.id, chName.value, j, categorey.id));
                });
            });

        });

        this.languages.forEach(lang => {
            for (let [key, value] of Array.from(this.allCategoreyMap)) {

                if (key.includes(lang)) {
                    this.elasticCategories.set(`category_${key.split('_')[0]}`, value);
                }
            }
        })

        this.loggerService.debug('mapping ends')

        return this.elasticCategories;
    }

    createCategoreyIfNeeded(lang: string) {
        if (!this.allCategoreyMap.has(lang)) {
            this.allCategoreyMap.set(lang, [])
        }
    }
}
