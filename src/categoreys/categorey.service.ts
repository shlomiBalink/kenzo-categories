import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { CsvService } from '../csv/csv.service';
import { SftpService } from '../sftp/sftp.service';
import { CsvStock, EnvironmentVariables, Stock } from './categorey.types';
import { writeFileSync, readFileSync } from 'fs';
import { MapperService } from 'src/mapper/mapper.service';
import { ElasticService } from 'src/elastic/elastic.service';

@Injectable()
export class CategoreyService {
  private static readonly LOG_CONTEXT = 'CategoryService';

  constructor(
    private loggerService: LoggerService,
    private configService: ConfigService<EnvironmentVariables>,
    private sftpService: SftpService,
    private csvService: CsvService,
    private mapperService: MapperService,
    private elasticService: ElasticService
  ) {
    this.loggerService.setContext(CategoreyService.LOG_CONTEXT);
  }

  async import() {
    // await this.sftpService.init();

    const sftpRoot = await this.configService.get('SFTP_ROOT');
    const categoriesFolderPath = await this.configService.get('SFTP_CATEGORIES_FOLDER_PATH');

    const productFolderFilesPath = (await this.sftpService.listFiles(`${sftpRoot}${categoriesFolderPath}`)).sort();

    const lastCategoriesFile = this.getLastestFile(productFolderFilesPath, "CATEGORIES");

    // writeFileSync('src/temp-data/lastCategoriesFile.json', await this.sftpService.getFileContent(lastCategoriesFile));

    // this.sftpService.moveFileToArchive(`${lastCategoriesFile}`, `${sftpRoot}/Archive${categoriesFolderPath}`);

    // this.sftpService.deleteFile(lastCategoriesFile);

    // this.loggerService.debug('Files create in local memorey');

    // await this.sftpService.closeConnection();

    const rawCategories = JSON.parse(readFileSync('src/temp-data/lastCategoriesFile.json', 'utf-8'));

    const elasticCategories = this.mapperService.map(rawCategories);

    for (let [key, value] of Array.from(elasticCategories)) {
       this.elasticService.pushToElastic(key, value)
    }




  }

  getLastestFile(arr: any[], str: string) {
    return arr.filter(el => el.includes(str)).pop();
  }
}
