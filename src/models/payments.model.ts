import { Entity, model, property } from '@loopback/repository';

@model()
export class Payments extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string'
  })
  status: string;

  @property({
    type: 'string'
  })
  id_payment: string;

  @property({
    type: 'string',
  })
  enterpriseId?: string;

  constructor(data?: Partial<Payments>) {
    super(data);
  }
}

export interface PaymentsRelations {
  // describe navigational properties here
}

export type PaymentsWithRelations = Payments & PaymentsRelations;
