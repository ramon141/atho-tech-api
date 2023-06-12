import { Entity, model, property } from '@loopback/repository';

@model()
export class Services extends Entity {
  @property({
    type: 'number',
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
  enterpriseId?: string;

  constructor(data?: Partial<Services>) {
    super(data);
  }
}

export interface ServicesRelations {
  // describe navigational properties here
}

export type ServicesWithRelations = Services & ServicesRelations;
