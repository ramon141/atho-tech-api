import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Services } from '../models';
import { ServicesRepository } from '../repositories';
export declare class ServicesController {
    servicesRepository: ServicesRepository;
    constructor(servicesRepository: ServicesRepository);
    create(services: Omit<Services, 'id'>): Promise<Services>;
    count(where?: Where<Services>): Promise<Count>;
    find(filter?: Filter<Services>): Promise<Services[]>;
    updateAll(services: Services, where?: Where<Services>): Promise<Count>;
    findById(id: number, filter?: FilterExcludingWhere<Services>): Promise<Services>;
    updateById(id: number, services: Services): Promise<void>;
    replaceById(id: number, services: Services): Promise<void>;
    deleteById(id: number): Promise<void>;
}
