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
  Payments,
} from '../models';
import { EnterpriseRepository } from '../repositories';

export class EnterprisePaymentsController {
  constructor(
    @repository(EnterpriseRepository) protected enterpriseRepository: EnterpriseRepository,
  ) { }

  @get('/enterprises/{id}/payments', {
    responses: {
      '200': {
        description: 'Array of Enterprise has many Payments',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Payments) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Payments>,
  ): Promise<Payments[]> {
    return this.enterpriseRepository.payments(id).find(filter);
  }

  @post('/enterprises/{id}/payments', {
    responses: {
      '200': {
        description: 'Enterprise model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Payments) } },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Enterprise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, {
            title: 'NewPaymentsInEnterprise',
            exclude: ['id'],
            optional: ['enterpriseId']
          }),
        },
      },
    }) payments: Omit<Payments, 'id'>,
  ): Promise<Payments> {
    return this.enterpriseRepository.payments(id).create(payments);
  }

  @patch('/enterprises/{id}/payments', {
    responses: {
      '200': {
        description: 'Enterprise.Payments PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, { partial: true }),
        },
      },
    })
    payments: Partial<Payments>,
    @param.query.object('where', getWhereSchemaFor(Payments)) where?: Where<Payments>,
  ): Promise<Count> {
    return this.enterpriseRepository.payments(id).patch(payments, where);
  }

  @del('/enterprises/{id}/payments', {
    responses: {
      '200': {
        description: 'Enterprise.Payments DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Payments)) where?: Where<Payments>,
  ): Promise<Count> {
    return this.enterpriseRepository.payments(id).delete(where);
  }
}
