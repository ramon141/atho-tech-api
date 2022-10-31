"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.RequestBody = exports.CreateUser = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const user_model_1 = require("../models/user.model");
const user_repository_1 = require("../repositories/user.repository");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const bcryptjs_1 = require("bcryptjs");
let CreateUser = class CreateUser extends user_model_1.User {
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], CreateUser.prototype, "password", void 0);
CreateUser = tslib_1.__decorate([
    (0, repository_1.model)()
], CreateUser);
exports.CreateUser = CreateUser;
const UserSchema = {
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
exports.RequestBody = {
    description: 'The input of login function',
    required: true,
    content: {
        'application/json': { schema: UserSchema },
    },
};
let UserController = class UserController {
    constructor(jwtService, userService, user, userRepository) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.user = user;
        this.userRepository = userRepository;
    }
    async signUp(newUserRequest) {
        newUserRequest.password = await (0, bcryptjs_1.hash)(newUserRequest.password, await (0, bcryptjs_1.genSalt)());
        newUserRequest.role = 'Vendedor';
        newUserRequest.name = newUserRequest.name.trim();
        newUserRequest.email = newUserRequest.email.trim();
        try {
            const { password, ...savedUser } = await this.userRepository.create(newUserRequest);
            return savedUser;
        }
        catch (error) {
            switch (error.code) {
                case 'ER_DUP_ENTRY':
                    throw new rest_1.HttpErrors.UnprocessableEntity('O Usuário já existe');
                default:
                    new rest_1.HttpErrors.UnprocessableEntity('Um erro desconhecido ocorreu');
            }
        }
    }
    async signIn(credentials) {
        const user = await this.userRepository.findById(credentials.email);
        if (!(0, bcryptjs_1.compareSync)(credentials.password, user.password))
            throw new rest_1.HttpErrors[401]('E-mail ou senha inválido(s)');
        const userProfile = {
            [security_1.securityId]: user.email.toString(),
            name: user.name,
            permission: user.role
        };
        const token = await this.jwtService.generateToken(userProfile);
        return { token };
    }
    async whoAmI(loggedInUserProfile) {
        return loggedInUserProfile[security_1.securityId];
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/signup', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': user_model_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(CreateUser, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
tslib_1.__decorate([
    (0, rest_1.post)('/login', {
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
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)(exports.RequestBody)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "signIn", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.get)('/whoami', {
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
    }),
    tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "whoAmI", null);
UserController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(authentication_jwt_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_jwt_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(2, (0, core_1.inject)(security_1.SecurityBindings.USER, { optional: true })),
    tslib_1.__param(3, (0, repository_1.repository)(user_repository_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [Object, authentication_jwt_1.MyUserService, Object, user_repository_1.UserRepository])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map