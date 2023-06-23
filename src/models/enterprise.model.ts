import { Entity, model, property, hasMany } from '@loopback/repository';
import { Products } from './products.model';
import { User } from './user.model';
import { Services } from './services.model';
import { Kits } from './kits.model';
import { Payments } from './payments.model';
import {Configuration} from './configuration.model';
import {Dependency} from './dependency.model';

@model()
export class Enterprise extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true
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

  @property({
    type: 'string',
    required: true,
  })
  cpf: string;

  @property({
    type: 'number',
    required: false,
    default: 2000,
  })
  budget: number;

  @property({
    type: 'date',
  })
  expire_date: string;

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

  @hasMany(() => Configuration)
  configurations: Configuration[];

  @hasMany(() => Dependency)
  dependencies: Dependency[];

  constructor(data?: Partial<Enterprise>) {
    super(data);
  }
}

export interface EnterpriseRelations {
  // describe navigational properties here
}

export type EnterpriseWithRelations = Enterprise & EnterpriseRelations;
