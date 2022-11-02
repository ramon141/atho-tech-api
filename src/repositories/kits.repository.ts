import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Kits, KitsRelations} from '../models';

export class KitsRepository extends DefaultCrudRepository<
  Kits,
  typeof Kits.prototype.id,
  KitsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Kits, dataSource);
  }
}
