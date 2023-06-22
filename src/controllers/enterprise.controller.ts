import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import { authenticate, TokenService } from '@loopback/authentication';
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
  HttpErrors,
  SchemaObject
} from '@loopback/rest';
import { Enterprise } from '../models';
import { EnterpriseRepository } from '../repositories';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import { compareSync, genSalt, hash } from 'bcryptjs';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { inject } from '@loopback/core';

const EnterpriseSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
    },
  },
};

export const EnterpriseRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: EnterpriseSchema },
  },
};

const EnterprisePutSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'name', 'password', 'olderPassword'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    name: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    olderPassword: {
      type: 'string',
    },
  },
};

export type EnterprisePut = {
  email: string;
  name: string;
  password: string;
  olderPassword: string;
};

export class EnterpriseController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
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
    const enterpriseExists = await this.enterpriseRepository.findOne({
      where: {
        email: enterprise.email
      }
    });

    if (enterpriseExists)
      throw new HttpErrors[401]('Uma empresa com o mesmo email foi cadastrada');

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

  @get('/enterprises/{id}/budget')
  @response(200, {
    description: 'Enterprise model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Enterprise, { includeRelations: true }),
      },
    },
  })
  async getBudget(
    @param.path.string('id') id: string,
  ): Promise<{ budget: number }> {
    return {
      budget: (await this.enterpriseRepository.findById(id)).budget
    };
  }

  @get('/enterprises/{id}/increment_budget')
  @response(200, {
    description: 'Enterprise model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Enterprise, { includeRelations: true }),
      },
    },
  })
  async incrementBudget(
    @param.path.string('id') id: string,
  ): Promise<void> {
    const { id: ignore, ...enterprise } = await this.enterpriseRepository.findById(id);
    enterprise.budget++;
    this.enterpriseRepository.updateById(id, enterprise);
  }

  @put('/enterprises/{id}')
  @response(204, {
    description: 'Enterprise PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update info about enterprises',
      required: true,
      content: {
        'application/json': { schema: EnterprisePutSchema },
      },
    }) data: EnterprisePut
  ): Promise<Enterprise> {
    const { olderPassword, name, password, email } = data;
    const enterprise = await this.enterpriseRepository.findById(id);

    if (!enterprise)
      throw new HttpErrors[401]('Empresa não encontrada');

    if (enterprise.password !== olderPassword)
      throw new HttpErrors[401]('A senha anterior está incorreta!');

    enterprise.name = name;
    enterprise.password = password;
    enterprise.email = email;

    await this.enterpriseRepository.replaceById(id, enterprise);

    return enterprise;
  }

  @authenticate('jwt')
  @get('/enterprise/whoami', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    loggedInUserProfile: UserProfile,
  ): Promise<{ id?: string | undefined, email: string, name: string, budget: number, quantUsers: number, quantProducts: number, quantServices: number }> {
    const email = loggedInUserProfile[securityId];

    const enterprise = await this.enterpriseRepository.findOne({
      where: {
        email: email
      },
      include: ['users', 'products', 'services']
    });

    if (!enterprise || !enterprise.id)
      throw new HttpErrors[401]('O email não foi cadastrado!');

    const { password, ...rest } = enterprise;

    return {
      ...rest,
      quantUsers: enterprise.users?.length || 0,
      quantProducts: enterprise.products?.length || 0,
      quantServices: enterprise.services?.length || 0,
    };
  }


  @del('/enterprises/{id}')
  @response(204, {
    description: 'Enterprise DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.enterpriseRepository.deleteById(id);
  }
}
