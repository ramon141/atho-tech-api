import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Dependency, DependencyRelations } from '../models';

export class DependencyRepository extends DefaultCrudRepository<
  Dependency,
  typeof Dependency.prototype.id,
  DependencyRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Dependency, dataSource);
  }
}
