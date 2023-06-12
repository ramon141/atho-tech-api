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
import { Enterprise } from '../models';
import { EnterpriseRepository } from '../repositories';

export class EnterpriseController {
  constructor(
    @repository(EnterpriseRepository)
    public enterpriseRepository: EnterpriseRepository,
  ) { }

  @post('/enterprises')
  @response(200, {
    description: 'Enterprise model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Enterprise) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enterprise, {
            title: 'NewEnterprise',
            exclude: ['id'],
          }),
        },
      },
    })
    enterprise: Omit<Enterprise, 'id'>,
  ): Promise<Enterprise> {
    return this.enterpriseRepository.create(enterprise);
  }

  @get('/enterprises/count')
  @response(200, {
    description: 'Enterprise model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Enterprise) where?: Where<Enterprise>,
  ): Promise<Count> {
    return this.enterpriseRepository.count(where);
  }

  @get('/enterprises')
  @response(200, {
    description: 'Array of Enterprise model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Enterprise, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Enterprise) filter?: Filter<Enterprise>,
  ): Promise<Enterprise[]> {
    return this.enterpriseRepository.find(filter);
  }

  @patch('/enterprises')
  @response(200, {
    description: 'Enterprise PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enterprise, { partial: true }),
        },
      },
    })
    enterprise: Enterprise,
    @param.where(Enterprise) where?: Where<Enterprise>,
  ): Promise<Count> {
    return this.enterpriseRepository.updateAll(enterprise, where);
  }

  @get('/enterprises/{id}')
  @response(200, {
    description: 'Enterprise model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Enterprise, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Enterprise, { exclude: 'where' }) filter?: FilterExcludingWhere<Enterprise>
  ): Promise<Enterprise> {
    return this.enterpriseRepository.findById(id, filter);
  }

  @patch('/enterprises/{id}')
  @response(204, {
    description: 'Enterprise PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enterprise, { partial: true }),
        },
      },
    })
    enterprise: Enterprise,
  ): Promise<void> {
    await this.enterpriseRepository.updateById(id, enterprise);
  }

  @put('/enterprises/{id}')
  @response(204, {
    description: 'Enterprise PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() enterprise: Enterprise,
  ): Promise<void> {
    await this.enterpriseRepository.replaceById(id, enterprise);
  }

  @del('/enterprises/{id}')
  @response(204, {
    description: 'Enterprise DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.enterpriseRepository.deleteById(id);
  }
}
