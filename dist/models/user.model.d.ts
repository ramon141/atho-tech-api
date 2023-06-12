import { Entity } from '@loopback/repository';
export declare class User extends Entity {
    email: string;
    password: string;
    name: string;
    role: string;
    enterpriseId?: string;
    [prop: string]: any;
    constructor(data?: Partial<User>);
}
export interface UserRelations {
}
export declare type UserWithRelations = User & UserRelations;
