import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Products, ProductsRelations, Configuration } from '../models';
import { ConfigurationRepository } from './configuration.repository';
export declare class ProductsRepository extends DefaultCrudRepository<Products, typeof Products.prototype.id, ProductsRelations> {
    protected configurationRepositoryGetter: Getter<ConfigurationRepository>;
    readonly configurations: HasManyRepositoryFactory<Configuration, typeof Products.prototype.id>;
    constructor(dataSource: MysqlDataSource, configurationRepositoryGetter: Getter<ConfigurationRepository>);
}
