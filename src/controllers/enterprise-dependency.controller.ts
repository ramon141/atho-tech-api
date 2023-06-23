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
  Dependency,
} from '../models';
import {EnterpriseRepository} from '../repositories';

export class EnterpriseDependencyController {
  constructor(
    @repository(EnterpriseRepository) protected enterpriseRepository: EnterpriseRepository,
  ) { }

  @get('/enterprises/{id}/dependencies', {
    responses: {
      '200': {
        description: 'Array of Enterprise has many Dependency',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Dependency)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Dependency>,
  ): Promise<Dependency[]> {
    return this.enterpriseRepository.dependencies(id).find(filter);
  }

  @post('/enterprises/{id}/dependencies', {
    responses: {
      '200': {
        description: 'Enterprise model instance',
        content: {'application/json': {schema: getModelSchemaRef(Dependency)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Enterprise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dependency, {
            title: 'NewDependencyInEnterprise',
            exclude: ['id'],
            optional: ['enterpriseId']
          }),
        },
      },
    }) dependency: Omit<Dependency, 'id'>,
  ): Promise<Dependency> {
    return this.enterpriseRepository.dependencies(id).create(dependency);
  }

  @patch('/enterprises/{id}/dependencies', {
    responses: {
      '200': {
        description: 'Enterprise.Dependency PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dependency, {partial: true}),
        },
      },
    })
    dependency: Partial<Dependency>,
    @param.query.object('where', getWhereSchemaFor(Dependency)) where?: Where<Dependency>,
  ): Promise<Count> {
    return this.enterpriseRepository.dependencies(id).patch(dependency, where);
  }

  @del('/enterprises/{id}/dependencies', {
    responses: {
      '200': {
        description: 'Enterprise.Dependency DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Dependency)) where?: Where<Dependency>,
  ): Promise<Count> {
    return this.enterpriseRepository.dependencies(id).delete(where);
  }
}
