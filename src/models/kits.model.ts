import { Entity, model, property } from '@loopback/repository';

@model()
export class Kits extends Entity {
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
  name: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  products: object[];

  constructor(data?: Partial<Kits>) {
    super(data);
  }
}

export interface KitsRelations {
  // describe navigational properties here
}

export type KitsWithRelations = Kits & KitsRelations;
