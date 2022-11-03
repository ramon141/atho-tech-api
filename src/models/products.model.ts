import { Entity, model, property, hasMany } from '@loopback/repository';
import { Configuration } from './configuration.model';

@model()
export class Products extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: false,
  })
  default_configuration: number;

  @hasMany(() => Configuration)
  configurations: Configuration[];

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
}

export type ProductsWithRelations = Products & ProductsRelations;
