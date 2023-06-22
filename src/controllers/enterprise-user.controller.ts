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
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {
  Enterprise,
  User,
} from '../models';
import { EnterpriseRepository } from '../repositories';
import { Credentials, TokenServiceBindings } from '@loopback/authentication-jwt';
import { securityId } from '@loopback/security';
import { inject } from '@loopback/core';
import { TokenService } from '@loopback/authentication';

const UserEnterpriseSchema: SchemaObject = {
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

export const RequestBodyEnterprise = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: UserEnterpriseSchema },
  },
};

export class EnterpriseUserController {
  constructor(
    @repository(EnterpriseRepository) protected enterpriseRepository: EnterpriseRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) { }

  @get('/enterprises/{id}/users', {
    responses: {
      '200': {
        description: 'Array of Enterprise has many User',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.enterpriseRepository.users(id).find(filter);
  }

  @post('/enterprises/{id}/users', {
    responses: {
      '200': {
        description: 'Enterprise model instance',
        content: { 'application/json': { schema: getModelSchemaRef(User) } },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Enterprise.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInEnterprise',
            optional: ['enterpriseId']
          }),
        },
      },
    }) user: User,
  ): Promise<User> {
    return this.enterpriseRepository.users(id).create(user);
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
    @requestBody(RequestBodyEnterprise) credentials: Credentials,
  ): Promise<{ token: string, name: string, email: string, id: string, cpf: string }> {
    const enterprise = await this.enterpriseRepository.findOne({
      where: {
        email: credentials.email
      }
    });

    if (!enterprise || !enterprise.id)
      throw new HttpErrors[401]('O email não foi cadastrado!');

    if (credentials.password !== enterprise.password)
      throw new HttpErrors[401]('E-mail ou senha inválido(s)');

    const userProfile = {
      [securityId]: enterprise.email.toString(),
      name: enterprise.name
    };

    const token = await this.jwtService.generateToken(userProfile);
    return {
      token,
      name: enterprise.name,
      email: enterprise.email,
      id: enterprise.id,
      cpf: enterprise.cpf
    };
  }


  @patch('/enterprises/{id}/users', {
    responses: {
      '200': {
        description: 'Enterprise.User PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.enterpriseRepository.users(id).patch(user, where);
  }

  @del('/enterprises/{id}/users', {
    responses: {
      '200': {
        description: 'Enterprise.User DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.enterpriseRepository.users(id).delete(where);
  }
}
