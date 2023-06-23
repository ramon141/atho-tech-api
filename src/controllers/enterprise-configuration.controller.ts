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
  Configuration,
} from '../models';
import {EnterpriseRepository} from '../repositories';

export class EnterpriseConfigurationController {
  constructor(
    @repository(EnterpriseRepository) protected enterpriseRepository: EnterpriseRepository,
  ) { }

  @get('/enterprises/{id}/configurations', {
    responses: {
      '200': {
        description: 'Array of Enterprise has many Configuration',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Configuration)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Configuration>,
  ): Promise<Configuration[]> {
    return this.enterpriseRepository.configurations(id).find(filter);
  }

  @post('/enterprises/{id}/configurations', {
    responses: {
      '200': {
        description: 'Enterprise model instance',
        content: {'application/json': {schema: getModelSchemaRef(Configuration)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Enterprise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, {
            title: 'NewConfigurationInEnterprise',
            exclude: ['id'],
            optional: ['enterpriseId']
          }),
        },
      },
    }) configuration: Omit<Configuration, 'id'>,
  ): Promise<Configuration> {
    return this.enterpriseRepository.configurations(id).create(configuration);
  }

  @patch('/enterprises/{id}/configurations', {
    responses: {
      '200': {
        description: 'Enterprise.Configuration PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, {partial: true}),
        },
      },
    })
    configuration: Partial<Configuration>,
    @param.query.object('where', getWhereSchemaFor(Configuration)) where?: Where<Configuration>,
  ): Promise<Count> {
    return this.enterpriseRepository.configurations(id).patch(configuration, where);
  }

  @del('/enterprises/{id}/configurations', {
    responses: {
      '200': {
        description: 'Enterprise.Configuration DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Configuration)) where?: Where<Configuration>,
  ): Promise<Count> {
    return this.enterpriseRepository.configurations(id).delete(where);
  }
}
