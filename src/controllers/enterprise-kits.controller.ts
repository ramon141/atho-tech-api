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
  Kits,
} from '../models';
import { EnterpriseRepository } from '../repositories';

export class EnterpriseKitsController {
  constructor(
    @repository(EnterpriseRepository) protected enterpriseRepository: EnterpriseRepository,
  ) { }

  @get('/enterprises/{id}/kits', {
    responses: {
      '200': {
        description: 'Array of Enterprise has many Kits',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Kits) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Kits>,
  ): Promise<Kits[]> {
    return this.enterpriseRepository.kits(id).find(filter);
  }

  @post('/enterprises/{id}/kits', {
    responses: {
      '200': {
        description: 'Enterprise model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Kits) } },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Enterprise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Kits, {
            title: 'NewKitsInEnterprise',
            exclude: ['id'],
            optional: ['enterpriseId']
          }),
        },
      },
    }) kits: Omit<Kits, 'id'>,
  ): Promise<Kits> {
    return this.enterpriseRepository.kits(id).create(kits);
  }

  @patch('/enterprises/{id}/kits', {
    responses: {
      '200': {
        description: 'Enterprise.Kits PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Kits, { partial: true }),
        },
      },
    })
    kits: Partial<Kits>,
    @param.query.object('where', getWhereSchemaFor(Kits)) where?: Where<Kits>,
  ): Promise<Count> {
    return this.enterpriseRepository.kits(id).patch(kits, where);
  }

  @del('/enterprises/{id}/kits', {
    responses: {
      '200': {
        description: 'Enterprise.Kits DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Kits)) where?: Where<Kits>,
  ): Promise<Count> {
    return this.enterpriseRepository.kits(id).delete(where);
  }
}
