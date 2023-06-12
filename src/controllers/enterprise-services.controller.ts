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
  Services,
} from '../models';
import { EnterpriseRepository } from '../repositories';

export class EnterpriseServicesController {
  constructor(
    @repository(EnterpriseRepository) protected enterpriseRepository: EnterpriseRepository,
  ) { }

  @get('/enterprises/{id}/services', {
    responses: {
      '200': {
        description: 'Array of Enterprise has many Services',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Services) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Services>,
  ): Promise<Services[]> {
    return this.enterpriseRepository.services(id).find(filter);
  }

  @post('/enterprises/{id}/services', {
    responses: {
      '200': {
        description: 'Enterprise model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Services) } },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Enterprise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Services, {
            title: 'NewServicesInEnterprise',
            exclude: ['id'],
            optional: ['enterpriseId']
          }),
        },
      },
    }) services: Omit<Services, 'id'>,
  ): Promise<Services> {
    return this.enterpriseRepository.services(id).create(services);
  }

  @patch('/enterprises/{id}/services', {
    responses: {
      '200': {
        description: 'Enterprise.Services PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Services, { partial: true }),
        },
      },
    })
    services: Partial<Services>,
    @param.query.object('where', getWhereSchemaFor(Services)) where?: Where<Services>,
  ): Promise<Count> {
    return this.enterpriseRepository.services(id).patch(services, where);
  }

  @del('/enterprises/{id}/services', {
    responses: {
      '200': {
        description: 'Enterprise.Services DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Services)) where?: Where<Services>,
  ): Promise<Count> {
    return this.enterpriseRepository.services(id).delete(where);
  }
}
