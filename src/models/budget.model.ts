import { Entity, model, property } from '@loopback/repository';

@model()
export class Budget extends Entity {
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
  quantity_budget: number;


  constructor(data?: Partial<Budget>) {
    super(data);
  }
}

export interface BudgetRelations {
  // describe navigational properties here
}

export type BudgetWithRelations = Budget & BudgetRelations;
