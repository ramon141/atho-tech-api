import { Entity } from '@loopback/repository';
import { Configuration } from './configuration.model';
export declare class Products extends Entity {
    id?: number;
    description: string;
    default_configuration: number;
    configurations: Configuration[];
    constructor(data?: Partial<Products>);
}
export interface ProductsRelations {
}
export declare type ProductsWithRelations = Products & ProductsRelations;
