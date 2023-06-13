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

  @post('/enterprise/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async signIn(
    @requestBody(EnterpriseRequestBody) credentials: Credentials,
  ): Promise<{ token: string, name: string, email: string }> {

    const user = await this.enterpriseRepository.findOne({
      where: {
        email: credentials.email
      }
    });

    if (!user?.password || credentials.password != user.password)
      throw new HttpErrors[401]('E-mail ou senha inválido(s)');

    const userProfile = {
      [securityId]: user.email!.toString(),
      name: user.name
    };

    const token = await this.jwtService.generateToken(userProfile);
    return {
      token,
      name: user.name,
      email: user.email
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
