import { inject, Getter} from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Dependency, DependencyRelations, Configuration} from '../models';
import {ConfigurationRepository} from './configuration.repository';

export class DependencyRepository extends DefaultCrudRepository<
  Dependency,
  typeof Dependency.prototype.id,
  DependencyRelations
> {

  public readonly configuration: BelongsToAccessor<Configuration, typeof Dependency.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ConfigurationRepository') protected configurationRepositoryGetter: Getter<ConfigurationRepository>,
  ) {
    super(Dependency, dataSource);
    this.configuration = this.createBelongsToAccessorFor('configuration', configurationRepositoryGetter,);
    this.registerInclusionResolver('configuration', this.configuration.inclusionResolver);
  }
}
