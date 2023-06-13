import { Entity, model, property, hasMany } from '@loopback/repository';
import { Configuration } from './configuration.model';

@model()
export class Products extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @hasMany(() => Configuration)
  configurations: Configuration[];

  @property({
    type: 'string',
  })
  enterpriseId?: string;

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
}

export type ProductsWithRelations = Products & ProductsRelations;
