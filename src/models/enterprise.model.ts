import { Entity, model, property, hasMany } from '@loopback/repository';
import { Products } from './products.model';
import { User } from './user.model';
import { Services } from './services.model';
import { Kits } from './kits.model';
import { Payments } from './payments.model';

@model()
export class Enterprise extends Entity {
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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => Products)
  products: Products[];

  @hasMany(() => User)
  users: User[];

  @hasMany(() => Services)
  services: Services[];

  @hasMany(() => Kits)
  kits: Kits[];

  @hasMany(() => Payments)
  payments: Payments[];

  constructor(data?: Partial<Enterprise>) {
    super(data);
  }
}

export interface EnterpriseRelations {
  // describe navigational properties here
}

export type EnterpriseWithRelations = Enterprise & EnterpriseRelations;
