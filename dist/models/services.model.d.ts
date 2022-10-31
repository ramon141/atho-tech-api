import { Entity } from '@loopback/repository';
export declare class Services extends Entity {
    id?: number;
    description: string;
    value: number;
    constructor(data?: Partial<Services>);
}
export interface ServicesRelations {
}
export declare type ServicesWithRelations = Services & ServicesRelations;
