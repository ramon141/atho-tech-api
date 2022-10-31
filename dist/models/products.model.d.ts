import { Entity } from '@loopback/repository';
export declare class Products extends Entity {
    id?: number;
    description: string;
    value: number;
    dependsOn: number;
    multiplier: number;
    constructor(data?: Partial<Products>);
}
export interface ProductsRelations {
}
export declare type ProductsWithRelations = Products & ProductsRelations;
