import { Entity, model, property } from '@loopback/repository';

@model()
export class Configuration extends Entity {
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

  @property({
    type: 'number',
    required: true,
    dataType: 'FLOAT'
  })
  value: number;

  @property({
    type: 'string',
  })
  productsId?: string;

  @property({
    type: 'string',
  })
  enterpriseId?: string;

  constructor(data?: Partial<Configuration>) {
    super(data);
  }
}

export interface ConfigurationRelations {
  // describe navigational properties here
}

export type ConfigurationWithRelations = Configuration & ConfigurationRelations;
