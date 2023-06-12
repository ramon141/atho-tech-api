import { authenticate } from '@loopback/authentication';
import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Dependency,
  Configuration,
} from '../models';
import { DependencyRepository } from '../repositories';

@authenticate('jwt')
export class DependencyConfigurationController {
  constructor(
    @repository(DependencyRepository)
    public dependencyRepository: DependencyRepository,
  ) { }

  @get('/dependencies/{id}/configuration', {
    responses: {
      '200': {
        description: 'Configuration belonging to Dependency',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Configuration) },
          },
        },
      },
    },
  })
  async getConfiguration(
    @param.path.string('id') id: typeof Dependency.prototype.id,
  ): Promise<Configuration> {
    return this.dependencyRepository.configuration(id);
  }
}
