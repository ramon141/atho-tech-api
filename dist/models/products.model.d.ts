import { Entity } from '@loopback/repository';
import { Configuration } from './configuration.model';
export declare class Products extends Entity {
    id?: string;
    description: string;
    configurations: Configuration[];
    enterpriseId?: string;
    constructor(data?: Partial<Products>);
}
export interface ProductsRelations {
}
export declare type ProductsWithRelations = Products & ProductsRelations;
