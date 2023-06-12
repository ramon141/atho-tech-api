import { authenticate } from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Configuration } from '../models';
import { ConfigurationRepository } from '../repositories';

@authenticate('jwt')
export class ConfigurationsController {
  constructor(
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
  ) { }

  @post('/configurations')
  @response(200, {
    description: 'Configuration model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Configuration) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, {
            title: 'NewConfiguration',
            exclude: ['id'],
          }),
        },
      },
    })
    configuration: Omit<Configuration, 'id'>,
  ): Promise<Configuration> {
    return this.configurationRepository.create(configuration);
  }

  @get('/configurations/count')
  @response(200, {
    description: 'Configuration model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Configuration) where?: Where<Configuration>,
  ): Promise<Count> {
    return this.configurationRepository.count(where);
  }

  @get('/configurations')
  @response(200, {
    description: 'Array of Configuration model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Configuration, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Configuration) filter?: Filter<Configuration>,
  ): Promise<Configuration[]> {
    return this.configurationRepository.find(filter);
  }

  @patch('/configurations')
  @response(200, {
    description: 'Configuration PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, { partial: true }),
        },
      },
    })
    configuration: Configuration,
    @param.where(Configuration) where?: Where<Configuration>,
  ): Promise<Count> {
    return this.configurationRepository.updateAll(configuration, where);
  }

  @get('/configurations/{id}')
  @response(200, {
    description: 'Configuration model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Configuration, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Configuration, { exclude: 'where' }) filter?: FilterExcludingWhere<Configuration>
  ): Promise<Configuration> {
    return this.configurationRepository.findById(id, filter);
  }

  @patch('/configurations/{id}')
  @response(204, {
    description: 'Configuration PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, { partial: true }),
        },
      },
    })
    configuration: Configuration,
  ): Promise<void> {
    await this.configurationRepository.updateById(id, configuration);
  }

  @put('/configurations/{id}')
  @response(204, {
    description: 'Configuration PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() configuration: Configuration,
  ): Promise<void> {
    await this.configurationRepository.replaceById(id, configuration);
  }

  @del('/configurations/{id}')
  @response(204, {
    description: 'Configuration DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.configurationRepository.deleteById(id);
  }
}
