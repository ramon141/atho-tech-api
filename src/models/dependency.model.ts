import { Entity, model, property } from '@loopback/repository';

@model()
export class Dependency extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  dependent_product: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['change_product', 'change_quantity'],
    }
  })
  type_dependency: string;

  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  condition_quantity: number[]; //relação de quantidade do produto original

  @property({
    type: 'number',
    required: false,
  })
  replace_product: number;

  @property({
    type: 'number',
    required: false,
  })
  to_product: number;

  @property({
    type: 'number',
    required: false,
  })
  multiplier: number;


  constructor(data?: Partial<Dependency>) {
    super(data);
  }
}

export interface DependencyRelations {
  // describe navigational properties here
}

export type DependencyWithRelations = Dependency & DependencyRelations;
