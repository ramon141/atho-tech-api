import { TokenService } from '@loopback/authentication';
import { Credentials, MyUserService } from '@loopback/authentication-jwt';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { SchemaObject } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
export declare class CreateUser extends User {
    password: string;
}
export declare const RequestBody: {
    description: string;
    required: boolean;
    content: {
        'application/json': {
            schema: SchemaObject;
        };
    };
};
export declare class UserController {
    jwtService: TokenService;
    userService: MyUserService;
    user: UserProfile;
    protected userRepository: UserRepository;
    constructor(jwtService: TokenService, userService: MyUserService, user: UserProfile, userRepository: UserRepository);
    signUp(newUserRequest: Omit<User, 'id'>): Promise<{
        [prop: string]: any;
        email: string;
        name: string;
        role: string;
        enterpriseId?: string | undefined;
    }>;
    signIn(credentials: Credentials): Promise<{
        token: string;
        role: string;
        name: string;
        email: string;
    }>;
    whoAmI(loggedInUserProfile: UserProfile): Promise<string>;
}
