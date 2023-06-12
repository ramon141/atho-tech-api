import { Entity } from '@loopback/repository';
export declare class Services extends Entity {
    id?: string;
    description: string;
    value: number;
    enterpriseId?: string;
    constructor(data?: Partial<Services>);
}
export interface ServicesRelations {
}
export declare type ServicesWithRelations = Services & ServicesRelations;
