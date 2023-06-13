import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Payments, PaymentsRelations } from '../models';

export class PaymentsRepository extends DefaultCrudRepository<
  Payments,
  typeof Payments.prototype.id,
  PaymentsRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MysqlDataSource,
  ) {
    super(Payments, dataSource);
  }
}