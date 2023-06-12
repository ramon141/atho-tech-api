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
import { Dependency } from '../models';
import { DependencyRepository } from '../repositories';

@authenticate('jwt')
export class DependencyController {
  constructor(
    @repository(DependencyRepository)
    public dependencyRepository: DependencyRepository,
  ) { }

  @post('/dependencies')
  @response(200, {
    description: 'Dependency model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Dependency) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dependency, {
            title: 'NewDependency',
            exclude: ['id'],
          }),
        },
      },
    })
    dependency: Omit<Dependency, 'id'>,
  ): Promise<Dependency> {
    return this.dependencyRepository.create(dependency);
  }

  @get('/dependencies/count')
  @response(200, {
    description: 'Dependency model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Dependency) where?: Where<Dependency>,
  ): Promise<Count> {
    return this.dependencyRepository.count(where);
  }

  @get('/dependencies')
  @response(200, {
    description: 'Array of Dependency model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Dependency, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Dependency) filter?: Filter<Dependency>,
  ): Promise<Dependency[]> {
    return this.dependencyRepository.find(filter);
  }

  @patch('/dependencies')
  @response(200, {
    description: 'Dependency PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dependency, { partial: true }),
        },
      },
    })
    dependency: Dependency,
    @param.where(Dependency) where?: Where<Dependency>,
  ): Promise<Count> {
    return this.dependencyRepository.updateAll(dependency, where);
  }

  @get('/dependencies/{id}')
  @response(200, {
    description: 'Dependency model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Dependency, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Dependency, { exclude: 'where' }) filter?: FilterExcludingWhere<Dependency>
  ): Promise<Dependency> {
    return this.dependencyRepository.findById(id, filter);
  }

  @patch('/dependencies/{id}')
  @response(204, {
    description: 'Dependency PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dependency, { partial: true }),
        },
      },
    })
    dependency: Dependency,
  ): Promise<void> {
    await this.dependencyRepository.updateById(id, dependency);
  }

  @put('/dependencies/{id}')
  @response(204, {
    description: 'Dependency PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() dependency: Dependency,
  ): Promise<void> {
    await this.dependencyRepository.replaceById(id, dependency);
  }

  @del('/dependencies/{id}')
  @response(204, {
    description: 'Dependency DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dependencyRepository.deleteById(id);
  }
}
