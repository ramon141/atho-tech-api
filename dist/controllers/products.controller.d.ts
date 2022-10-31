import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Products } from '../models';
import { ProductsRepository } from '../repositories';
export declare class ProductsController {
    productsRepository: ProductsRepository;
    constructor(productsRepository: ProductsRepository);
    create(products: Omit<Products, 'id'>): Promise<Products>;
    count(where?: Where<Products>): Promise<Count>;
    find(filter?: Filter<Products>): Promise<Products[]>;
    updateAll(products: Products, where?: Where<Products>): Promise<Count>;
    findById(id: number, filter?: FilterExcludingWhere<Products>): Promise<Products>;
    updateById(id: number, products: Products): Promise<void>;
    replaceById(id: number, products: Products): Promise<void>;
    deleteById(id: number): Promise<void>;
}
