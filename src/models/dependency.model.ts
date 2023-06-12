import { Entity, model, property, hasOne, belongsTo } from '@loopback/repository';
import { Configuration } from './configuration.model';

@model()
export class Dependency extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  depends_on: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['change_quantity', 'change_configuration'],
    }
  })
  type_dependency: string;

  @property({
    type: 'array',
    itemType: 'number',
    required: false,
  })
  condition_quantity: number[];

  @property({
    type: 'number',
    required: false,
    dataType: 'FLOAT'
  })
  multiplier: number;

  @hasOne(() => Configuration)
  configuration: Configuration;

  @belongsTo(() => Configuration)
  configurationId: number;

  constructor(data?: Partial<Dependency>) {
    super(data);
  }
}

export interface DependencyRelations {
  // describe navigational properties here
}

export type DependencyWithRelations = Dependency & DependencyRelations;
