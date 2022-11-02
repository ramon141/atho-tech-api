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
import { Kits } from '../models';
import { KitsRepository } from '../repositories';

@authenticate('jwt')
export class KitsController {
  constructor(
    @repository(KitsRepository)
    public kitsRepository: KitsRepository,
  ) { }

  @post('/kits')
  @response(200, {
    description: 'Kits model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Kits) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Kits, {
            title: 'NewKits',
            exclude: ['id'],
          }),
        },
      },
    })
    kits: Omit<Kits, 'id'>,
  ): Promise<Kits> {
    return this.kitsRepository.create(kits);
  }

  @get('/kits/count')
  @response(200, {
    description: 'Kits model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Kits) where?: Where<Kits>,
  ): Promise<Count> {
    return this.kitsRepository.count(where);
  }

  @get('/kits')
  @response(200, {
    description: 'Array of Kits model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Kits, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Kits) filter?: Filter<Kits>,
  ): Promise<Kits[]> {
    return this.kitsRepository.find(filter);
  }

  @patch('/kits')
  @response(200, {
    description: 'Kits PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Kits, { partial: true }),
        },
      },
    })
    kits: Kits,
    @param.where(Kits) where?: Where<Kits>,
  ): Promise<Count> {
    return this.kitsRepository.updateAll(kits, where);
  }

  @get('/kits/{id}')
  @response(200, {
    description: 'Kits model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Kits, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Kits, { exclude: 'where' }) filter?: FilterExcludingWhere<Kits>
  ): Promise<Kits> {
    return this.kitsRepository.findById(id, filter);
  }

  @patch('/kits/{id}')
  @response(204, {
    description: 'Kits PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Kits, { partial: true }),
        },
      },
    })
    kits: Kits,
  ): Promise<void> {
    await this.kitsRepository.updateById(id, kits);
  }

  @put('/kits/{id}')
  @response(204, {
    description: 'Kits PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() kits: Kits,
  ): Promise<void> {
    await this.kitsRepository.replaceById(id, kits);
  }

  @del('/kits/{id}')
  @response(204, {
    description: 'Kits DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.kitsRepository.deleteById(id);
  }
}
