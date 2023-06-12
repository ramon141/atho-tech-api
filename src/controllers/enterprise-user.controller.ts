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
  User,
} from '../models';
import { EnterpriseRepository } from '../repositories';

export class EnterpriseUserController {
  constructor(
    @repository(EnterpriseRepository) protected enterpriseRepository: EnterpriseRepository,
  ) { }

  @get('/enterprises/{id}/users', {
    responses: {
      '200': {
        description: 'Array of Enterprise has many User',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.enterpriseRepository.users(id).find(filter);
  }

  @post('/enterprises/{id}/users', {
    responses: {
      '200': {
        description: 'Enterprise model instance',
        content: { 'application/json': { schema: getModelSchemaRef(User) } },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Enterprise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInEnterprise',
            optional: ['enterpriseId']
          }),
        },
      },
    }) user: User,
  ): Promise<User> {
    return this.enterpriseRepository.users(id).create(user);
  }

  @patch('/enterprises/{id}/users', {
    responses: {
      '200': {
        description: 'Enterprise.User PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.enterpriseRepository.users(id).patch(user, where);
  }

  @del('/enterprises/{id}/users', {
    responses: {
      '200': {
        description: 'Enterprise.User DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.enterpriseRepository.users(id).delete(where);
  }
}
