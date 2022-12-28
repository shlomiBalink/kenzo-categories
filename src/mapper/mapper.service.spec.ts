import { Test, TestingModule } from '@nestjs/testing';
import { MapperService } from './mapper.service';
import { Categorey } from './mapper.types';

describe('MapperService', () => {
  let service: MapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapperService],
    }).compile();

    service = module.get<MapperService>(MapperService);
  });

  it('should map raw categories to a map of categories', () => {
    const rawCategories = [
      {
        store_region: 'en',
        id: 1,
        names: [{ lang: 'en', value: 'Category 1' }],
        childs: [
          {
            id: 2,
            names: [{ lang: 'en', value: 'Subcategory 1' }],
          },
        ],
      },
      {
        store_region: 'fr',
        id: 3,
        names: [{ lang: 'fr', value: 'Catégorie 1' }],
        childs: [
          {
            id: 4,
            names: [{ lang: 'fr', value: 'Sous-catégorie 1' }],
          },
        ],
      },
    ];

    const expectedMap = new Map([
      [
        'category_en',
        [
          new Categorey('en', 1, 'Category 1', 0),
          new Categorey('en', 2, 'Subcategory 1', 0, 1),
        ],
      ],
      [
        'category_fr',
        [
          new Categorey('fr', 3, 'Catégorie 1', 0),
          new Categorey('fr', 4, 'Sous-catégorie 1', 0, 3),
        ],
      ],
    ]);

    expect(service.map(rawCategories)).toEqual(expectedMap);
  });

  it('should create a new entry in the allCategoreyMap map if one does not exist for the given language', () => {
    service.createCategoreyIfNeeded('en');
    expect(service.allCategoreyMap.has('en')).toBe(true);
    expect(service.allCategoreyMap.get('en')).toEqual([]);
  });
  
  it('should not create a new entry in the allCategoreyMap map if one already exists for the given language', () => {
    const categorey1 = new Categorey('en', 1, 'Category 1', 0);
    service.allCategoreyMap.set('en', [categorey1]);
    service.createCategoreyIfNeeded('en');
    expect(service.allCategoreyMap.has('en')).toBe(true);
    expect(service.allCategoreyMap.get('en')).toEqual([categorey1]);
  });
});
