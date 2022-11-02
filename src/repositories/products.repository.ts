import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Products, ProductsRelations, Configuration} from '../models';
import {ConfigurationRepository} from './configuration.repository';

export class ProductsRepository extends DefaultCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductsRelations
> {

  public readonly configurations: HasManyRepositoryFactory<Configuration, typeof Products.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ConfigurationRepository') protected configurationRepositoryGetter: Getter<ConfigurationRepository>,
  ) {
    super(Products, dataSource);
    this.configurations = this.createHasManyRepositoryFactoryFor('configurations', configurationRepositoryGetter,);
    this.registerInclusionResolver('configurations', this.configurations.inclusionResolver);
  }
}
