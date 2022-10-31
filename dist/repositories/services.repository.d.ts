import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Services, ServicesRelations } from '../models';
export declare class ServicesRepository extends DefaultCrudRepository<Services, typeof Services.prototype.id, ServicesRelations> {
    constructor(dataSource: MysqlDataSource);
}
