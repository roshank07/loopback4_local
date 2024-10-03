import {inject} from '@loopback/core';
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
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import * as fs from 'fs';
import * as path from 'path';
import userDump from '../config/users.json';
import {MSSQLDataSource} from '../datasources/mssql.datasource';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {UserService2} from '../services/user.service2';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    // @inject('services.UserService') private userService: UserService,
    @inject('datasources.MSSQLDataSource') private dataSource: MSSQLDataSource

  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {

    console.log('userDUmppppp',userDump);
    return this.userRepository.count(where);

  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  // @get('/users/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'User model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(User, {includeRelations: true}),
  //         },
  //       },
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(User, {exclude: 'where'}) filter?: Filter<User>
  // ): Promise<User> {

  //   return this.userRepository.findById(id, filter);
  // }


  @post('/findusers', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
   @requestBody() req:any
  ): Promise<User | null> {
    // Raw SQL query
    const sql = 'SELECT * FROM test.dbo.[User] WHERE username = @username';

    try {
      // Execute raw SQL query
    const username = req.username;
    const id = req.id;
    const userService = new UserService2();
    const query = 'SELECT * FROM test.dbo.[User] WHERE username != @username AND id = @id'; // Example query
    const result=await userService.getUserByUsername(query, {username: username, id: id} );
      // Return the user if found, otherwise return null
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error executing raw SQL query:', error);
      throw error; // You can customize error handling here
    }
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
    @get('/dump-users', {
    responses: {
      '200': {
        description: 'Dump users to JSON file',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async dumpUsersToJson(): Promise<{ message: string }> {
    const query = 'SELECT * FROM test.dbo.[User]'; // Adjust the table name as needed
     try {
      const userService = new UserService2();
      const result = await userService.getUserByUsername(query, {});
       // Define the path to the JSON file
      const dirPath = path.join(process.cwd(), 'src/config');
      const filePath = path.join(dirPath, 'users.json');

      console.log('Directory Path:', dirPath);
      console.log('File Path:', filePath);

      // Ensure the directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log('Directory created:', dirPath);
      } else {
        console.log('Directory already exists:', dirPath);
      }

      // Write the result to the JSON file
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
      console.log('File written:', filePath);



      return { message: 'Users dumped to JSON file successfully' };
    } catch (error) {
      console.error('Error dumping users to JSON file:', error);
      throw error; // You can customize error handling here
    }
  }
}
