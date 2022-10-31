import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings
} from '@loopback/authentication-jwt';

import {
  User
} from '../models/user.model';

import {UserRepository} from '../repositories/user.repository';

import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors, post,
  requestBody,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {compareSync, genSalt, hash} from 'bcryptjs';

@model()
export class CreateUser extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const UserSchema: SchemaObject = {
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

export const RequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: UserSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })

  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CreateUser, {
            title: 'NewUser',
          }),
        },
      },
    }) newUserRequest: Omit<User, 'id'>) {
    newUserRequest.password = await hash(newUserRequest.password, await genSalt());
    newUserRequest.role = 'Vendedor';
    newUserRequest.name = newUserRequest.name.trim();
    newUserRequest.email = newUserRequest.email.trim();

    try {
      const {password, ...savedUser} = await this.userRepository.create(newUserRequest);
      return savedUser;
    } catch (error) {
      switch (error.code) {
        case 'ER_DUP_ENTRY':
          throw new HttpErrors.UnprocessableEntity('O Usuário já existe');
        default:
          new HttpErrors.UnprocessableEntity('Um erro desconhecido ocorreu');
      }
    }
  }

  @post('/login', {
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
    @requestBody(RequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userRepository.findById(credentials.email);

    if (!compareSync(credentials.password, user.password))
      throw new HttpErrors[401]('E-mail ou senha inválido(s)');

    const userProfile = {
      [securityId]: user.email!.toString(),
      name: user.name,
      permission: user.role
    };

    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoami', {
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
  ): Promise<string> {
    return loggedInUserProfile[securityId];
  }
}
