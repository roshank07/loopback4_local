import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false, // Set to false if you want to allow additional properties in the model
  },
})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'boolean'
  })
  error_flag?: boolean;

  @property({
    type: 'number',
  })
  version: number | null;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // define navigational properties here
}

export type UserWithRelations = User & UserRelations;
