import { authenticate } from '@loopback/authentication';
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
  Products,
  Configuration,
} from '../models';
import { ProductsRepository } from '../repositories';

@authenticate('jwt')
export class ProductsConfigurationController {
  constructor(
    @repository(ProductsRepository) protected productsRepository: ProductsRepository,
  ) { }

  @get('/products/{id}/configurations', {
    responses: {
      '200': {
        description: 'Array of Products has many Configuration',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Configuration) },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Configuration>,
  ): Promise<Configuration[]> {
    return this.productsRepository.configurations(id).find(filter);
  }

  @post('/products/{id}/configurations', {
    responses: {
      '200': {
        description: 'Products model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Configuration) } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Products.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, {
            title: 'NewConfigurationInProducts',
            exclude: ['id'],
            optional: ['productsId']
          }),
        },
      },
    }) configuration: Omit<Configuration, 'id'>,
  ): Promise<Configuration> {
    return this.productsRepository.configurations(id).create(configuration);
  }

  @patch('/products/{id}/configurations', {
    responses: {
      '200': {
        description: 'Products.Configuration PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, { partial: true }),
        },
      },
    })
    configuration: Partial<Configuration>,
    @param.query.object('where', getWhereSchemaFor(Configuration)) where?: Where<Configuration>,
  ): Promise<Count> {
    return this.productsRepository.configurations(id).patch(configuration, where);
  }

  @del('/products/{id}/configurations', {
    responses: {
      '200': {
        description: 'Products.Configuration DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Configuration)) where?: Where<Configuration>,
  ): Promise<Count> {
    return this.productsRepository.configurations(id).delete(where);
  }
}
