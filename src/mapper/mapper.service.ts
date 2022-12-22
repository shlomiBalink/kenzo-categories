import { Injectable } from '@nestjs/common';
import { Categorey } from './mapper.types';

@Injectable()
export class MapperService {

    languages = ['en', 'es', 'fr', 'ja'];

    allCategoreyMap = new Map<string, Categorey[]>();
    elasticCategories = new Map<string, Categorey[]>();

    map(obj: any): Map<string, Categorey[]> {


        obj.forEach((cat, i) => {
            cat.names.forEach(name => {
                this.createCategoreyIfNeeded(name.lang);
                this.allCategoreyMap.get(name.lang).push(new Categorey(cat.store_region, cat.id, name.value, i));
            });

            cat.childs.forEach((child, j) => {
                child.names.forEach(chName => {
                    this.createCategoreyIfNeeded(chName.lang);
                    this.allCategoreyMap.get(chName.lang).push(new Categorey(cat.store_region, child.id, chName.value, j, cat.id));
                });
            });

        });

        this.languages.forEach(lang => {
            for (let [key, value] of Array.from(this.allCategoreyMap)) {
                
                if(key.includes(lang)){
                    this.elasticCategories.set(`category_${key.split('_')[0]}`, value);
                }
            }
        })
        
        return this.elasticCategories;
    }

    createCategoreyIfNeeded(lang: string) {
        if (!this.allCategoreyMap.has(lang)) {
            this.allCategoreyMap.set(lang, [])
        }
    }
}
