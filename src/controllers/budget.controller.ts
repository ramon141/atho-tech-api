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
import {Budget} from '../models';
import {BudgetRepository} from '../repositories';

export class BudgetController {
  constructor(
    @repository(BudgetRepository)
    public budgetRepository : BudgetRepository,
  ) {}

  @post('/budgets')
  @response(200, {
    description: 'Budget model instance',
    content: {'application/json': {schema: getModelSchemaRef(Budget)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Budget, {
            title: 'NewBudget',
            exclude: ['id'],
          }),
        },
      },
    })
    budget: Omit<Budget, 'id'>,
  ): Promise<Budget> {
    return this.budgetRepository.create(budget);
  }

  @get('/budgets/count')
  @response(200, {
    description: 'Budget model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Budget) where?: Where<Budget>,
  ): Promise<Count> {
    return this.budgetRepository.count(where);
  }

  @get('/budgets')
  @response(200, {
    description: 'Array of Budget model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Budget, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Budget) filter?: Filter<Budget>,
  ): Promise<Budget[]> {
    return this.budgetRepository.find(filter);
  }

  @patch('/budgets')
  @response(200, {
    description: 'Budget PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Budget, {partial: true}),
        },
      },
    })
    budget: Budget,
    @param.where(Budget) where?: Where<Budget>,
  ): Promise<Count> {
    return this.budgetRepository.updateAll(budget, where);
  }

  @get('/budgets/{id}')
  @response(200, {
    description: 'Budget model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Budget, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Budget, {exclude: 'where'}) filter?: FilterExcludingWhere<Budget>
  ): Promise<Budget> {
    return this.budgetRepository.findById(id, filter);
  }

  @patch('/budgets/{id}')
  @response(204, {
    description: 'Budget PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Budget, {partial: true}),
        },
      },
    })
    budget: Budget,
  ): Promise<void> {
    await this.budgetRepository.updateById(id, budget);
  }

  @put('/budgets/{id}')
  @response(204, {
    description: 'Budget PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() budget: Budget,
  ): Promise<void> {
    await this.budgetRepository.replaceById(id, budget);
  }

  @del('/budgets/{id}')
  @response(204, {
    description: 'Budget DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.budgetRepository.deleteById(id);
  }
}
