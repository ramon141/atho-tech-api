import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Enterprise,
  Products,
} from '../models';
import { EnterpriseRepository } from '../repositories';

export class EnterpriseProductsController {
  constructor(
    @repository(EnterpriseRepository) protected enterpriseRepository: EnterpriseRepository,
  ) { }

  @get('/enterprises/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Enterprise has many Products',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Products) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Products>,
  ): Promise<Products[]> {
    return this.enterpriseRepository.products(id).find(filter);
  }

  @post('/enterprises/{id}/products', {
    responses: {
      '200': {
        description: 'Enterprise model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Products) } },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Enterprise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {
            title: 'NewProductsInEnterprise',
            exclude: ['id'],
            optional: ['enterpriseId']
          }),
        },
      },
    }) products: Omit<Products, 'id'>,
  ): Promise<Products> {
    return this.enterpriseRepository.products(id).create(products);
  }

  @patch('/enterprises/{id}/products', {
    responses: {
      '200': {
        description: 'Enterprise.Products PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, { partial: true }),
        },
      },
    })
    products: Partial<Products>,
    @param.query.object('where', getWhereSchemaFor(Products)) where?: Where<Products>,
  ): Promise<Count> {
    return this.enterpriseRepository.products(id).patch(products, where);
  }

  @del('/enterprises/{id}/products', {
    responses: {
      '200': {
        description: 'Enterprise.Products DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Products)) where?: Where<Products>,
  ): Promise<Count> {
    return this.enterpriseRepository.products(id).delete(where);
  }
}
